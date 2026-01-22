"""
Security utilities for authentication, password hashing, and PDF verification
"""
import hashlib
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv

load_dotenv()

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS = 30


class PasswordHasher:
    """Handles password hashing and verification"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password string
        """
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash
        
        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password to compare against
            
        Returns:
            True if password matches, False otherwise
        """
        return pwd_context.verify(plain_password, hashed_password)


class PDFHasher:
    """Handles PDF file hashing for integrity verification and duplicate detection"""
    
    @staticmethod
    def hash_pdf(pdf_bytes: bytes) -> str:
        """
        Generate SHA-256 hash of PDF file
        
        Args:
            pdf_bytes: PDF file content as bytes
            
        Returns:
            Hexadecimal hash string
        """
        return hashlib.sha256(pdf_bytes).hexdigest()
    
    @staticmethod
    def hash_pdf_with_metadata(pdf_bytes: bytes, user_id: str, timestamp: Optional[datetime] = None) -> Dict[str, str]:
        """
        Generate comprehensive hash with metadata
        
        Args:
            pdf_bytes: PDF file content as bytes
            user_id: ID of user uploading the file
            timestamp: Optional timestamp (defaults to now)
            
        Returns:
            Dictionary containing file_hash, combined_hash, and metadata
        """
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        # Hash the file content
        file_hash = hashlib.sha256(pdf_bytes).hexdigest()
        
        # Create a combined hash with metadata for uniqueness
        metadata_string = f"{file_hash}:{user_id}:{timestamp.isoformat()}"
        combined_hash = hashlib.sha256(metadata_string.encode()).hexdigest()
        
        return {
            "file_hash": file_hash,
            "combined_hash": combined_hash,
            "user_id": user_id,
            "timestamp": timestamp.isoformat(),
            "file_size": len(pdf_bytes)
        }
    
    @staticmethod
    def verify_pdf_integrity(pdf_bytes: bytes, expected_hash: str) -> bool:
        """
        Verify PDF file integrity by comparing hashes
        
        Args:
            pdf_bytes: PDF file content as bytes
            expected_hash: Expected hash value
            
        Returns:
            True if hashes match, False otherwise
        """
        actual_hash = hashlib.sha256(pdf_bytes).hexdigest()
        return actual_hash == expected_hash


class JWTHandler:
    """Handles JWT token creation and validation"""
    
    @staticmethod
    def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """
        Create a JWT access token
        
        Args:
            data: Dictionary of claims to encode in the token
            expires_delta: Optional custom expiration time
            
        Returns:
            Encoded JWT token string
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access"
        })
        
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: Dict[str, Any]) -> str:
        """
        Create a JWT refresh token
        
        Args:
            data: Dictionary of claims to encode in the token
            
        Returns:
            Encoded JWT refresh token string
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh"
        })
        
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def decode_token(token: str) -> Dict[str, Any]:
        """
        Decode and validate a JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            Decoded token payload
            
        Raises:
            HTTPException: If token is invalid or expired
        """
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    def verify_token_type(payload: Dict[str, Any], expected_type: str) -> bool:
        """
        Verify the token type matches expected type
        
        Args:
            payload: Decoded token payload
            expected_type: Expected token type ('access' or 'refresh')
            
        Returns:
            True if token type matches
            
        Raises:
            HTTPException: If token type doesn't match
        """
        token_type = payload.get("type")
        if token_type != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token type. Expected {expected_type}, got {token_type}",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return True


class SecurityValidator:
    """Additional security validation utilities"""
    
    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """
        Validate password meets security requirements
        
        Args:
            password: Password to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one digit"
        
        # Check for special characters
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        if not any(c in special_chars for c in password):
            return False, "Password must contain at least one special character"
        
        return True, ""
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """
        Sanitize filename to prevent path traversal attacks
        
        Args:
            filename: Original filename
            
        Returns:
            Sanitized filename
        """
        # Remove path components
        filename = os.path.basename(filename)
        
        # Remove or replace dangerous characters
        dangerous_chars = ['..', '/', '\\', '\x00']
        for char in dangerous_chars:
            filename = filename.replace(char, '_')
        
        return filename
    
    @staticmethod
    def validate_file_size(file_size: int, max_size_mb: int = 10) -> bool:
        """
        Validate file size is within acceptable limits
        
        Args:
            file_size: File size in bytes
            max_size_mb: Maximum allowed size in megabytes
            
        Returns:
            True if file size is acceptable
            
        Raises:
            HTTPException: If file is too large
        """
        max_size_bytes = max_size_mb * 1024 * 1024
        if file_size > max_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum allowed size of {max_size_mb}MB"
            )
        return True


# Convenience functions
def hash_password(password: str) -> str:
    """Convenience function for password hashing"""
    return PasswordHasher.hash_password(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Convenience function for password verification"""
    return PasswordHasher.verify_password(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any]) -> str:
    """Convenience function for creating access tokens"""
    return JWTHandler.create_access_token(data)


def create_refresh_token(data: Dict[str, Any]) -> str:
    """Convenience function for creating refresh tokens"""
    return JWTHandler.create_refresh_token(data)


def decode_token(token: str) -> Dict[str, Any]:
    """Convenience function for decoding tokens"""
    return JWTHandler.decode_token(token)


def hash_pdf(pdf_bytes: bytes) -> str:
    """Convenience function for PDF hashing"""
    return PDFHasher.hash_pdf(pdf_bytes)


def hash_pdf_with_metadata(pdf_bytes: bytes, user_id: str) -> Dict[str, str]:
    """Convenience function for PDF hashing with metadata"""
    return PDFHasher.hash_pdf_with_metadata(pdf_bytes, user_id)
