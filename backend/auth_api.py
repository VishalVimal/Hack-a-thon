"""
Enhanced Authentication API with JWT and Password Hashing
"""
from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import os
from supabase import create_client, Client
from slowapi import Limiter
from slowapi.util import get_remote_address

from security import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_refresh_token,
    decode_token,
    JWTHandler,
    SecurityValidator
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://lixbzbmgkxnbqkuwtdje.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "your-service-key-here")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Security
security = HTTPBearer()

# Router
auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    role: str = Field(default="candidate", pattern="^(candidate|recruiter)$")
    company_name: Optional[str] = None  # For recruiters
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)


class PasswordResetRequest(BaseModel):
    email: EmailStr


# Helper Functions
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validate JWT token and return current user
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    # Verify it's an access token
    JWTHandler.verify_token_type(payload, "access")
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Fetch user from database
    try:
        result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return result.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user"
        )


async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """
    Ensure user account is active
    """
    if current_user.get("is_active") == False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return current_user


# Authentication Endpoints
@auth_router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(user_data: UserRegister, request: Request):
    """
    Register a new user with enhanced security
    """
    # Validate password strength
    is_valid, error_msg = SecurityValidator.validate_password_strength(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Check if user already exists
    existing_user = supabase.table("profiles").select("id").eq("email", user_data.email).execute()
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "role": user_data.role,
                    "full_name": user_data.full_name
                }
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )
        
        user_id = auth_response.user.id
        
        # Hash the password for our own storage (additional security layer)
        hashed_password = hash_password(user_data.password)
        
        # Create profile with hashed password
        profile_data = {
            "id": user_id,
            "email": user_data.email,
            "password_hash": hashed_password,
            "full_name": user_data.full_name,
            "role": user_data.role,
            "phone": user_data.phone,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        if user_data.role == "recruiter" and user_data.company_name:
            profile_data["company_name"] = user_data.company_name
        
        profile_result = supabase.table("profiles").insert(profile_data).execute()
        
        if not profile_result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user profile"
            )
        
        # Create JWT tokens
        token_data = {
            "sub": user_id,
            "email": user_data.email,
            "role": user_data.role
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token({"sub": user_id})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": profile_result.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@auth_router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(credentials: UserLogin, request: Request):
    """
    Login with email and password
    """
    try:
        # Fetch user profile
        user_result = supabase.table("profiles").select("*").eq("email", credentials.email).execute()
        
        if not user_result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = user_result.data[0]
        
        # Verify password using our hash
        if "password_hash" in user and user["password_hash"]:
            if not verify_password(credentials.password, user["password_hash"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
        else:
            # Fallback to Supabase auth if no local hash
            auth_response = supabase.auth.sign_in_with_password({
                "email": credentials.email,
                "password": credentials.password
            })
            
            if not auth_response.user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
        
        # Check if account is active
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Update last login
        supabase.table("profiles").update({
            "last_login": datetime.utcnow().isoformat()
        }).eq("id", user["id"]).execute()
        
        # Create JWT tokens
        token_data = {
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token({"sub": user["id"]})
        
        # Remove sensitive data before returning
        user_safe = {k: v for k, v in user.items() if k != "password_hash"}
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user_safe
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@auth_router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_request: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    """
    try:
        # Decode refresh token
        payload = decode_token(token_request.refresh_token)
        
        # Verify it's a refresh token
        JWTHandler.verify_token_type(payload, "refresh")
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        # Fetch user
        user_result = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not user_result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        user = user_result.data[0]
        
        # Create new tokens
        token_data = {
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        }
        
        access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token({"sub": user["id"]})
        
        user_safe = {k: v for k, v in user.items() if k != "password_hash"}
        
        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "user": user_safe
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not refresh token"
        )


@auth_router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout current user (client should discard tokens)
    """
    # In a production system, you might want to blacklist the token
    # For now, we just return success and let the client handle token removal
    return {"message": "Successfully logged out"}


@auth_router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    """
    Get current user information
    """
    user_safe = {k: v for k, v in current_user.items() if k != "password_hash"}
    return user_safe


@auth_router.put("/change-password")
@limiter.limit("3/hour")
async def change_password(
    password_data: PasswordChangeRequest,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """
    Change user password
    """
    # Validate new password strength
    is_valid, error_msg = SecurityValidator.validate_password_strength(password_data.new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Verify old password
    if "password_hash" in current_user and current_user["password_hash"]:
        if not verify_password(password_data.old_password, current_user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )
    
    # Hash new password
    new_hash = hash_password(password_data.new_password)
    
    # Update password in database
    try:
        supabase.table("profiles").update({
            "password_hash": new_hash,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", current_user["id"]).execute()
        
        # Also update in Supabase Auth
        supabase.auth.update_user({
            "password": password_data.new_password
        })
        
        return {"message": "Password changed successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password"
        )


@auth_router.post("/request-password-reset")
@limiter.limit("3/hour")
async def request_password_reset(reset_data: PasswordResetRequest, request: Request):
    """
    Request password reset email
    """
    try:
        # Send password reset email via Supabase
        supabase.auth.reset_password_email(reset_data.email)
        
        # Always return success to prevent email enumeration
        return {"message": "If the email exists, a password reset link has been sent"}
        
    except Exception as e:
        # Don't reveal if email exists or not
        return {"message": "If the email exists, a password reset link has been sent"}


# Export dependencies for use in other modules
__all__ = [
    "auth_router",
    "get_current_user",
    "get_current_active_user",
    "limiter"
]
