from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from supabase import create_client, Client
from datetime import datetime
import uuid
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import our enhanced authentication
from auth_api import auth_router, get_current_user, get_current_active_user, limiter

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://lixbzbmgkxnbqkuwtdje.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "your-service-key-here")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI(title="Recruitment Platform API", version="2.0.0")

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware with enhanced security
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
)

# Include authentication router
app.include_router(auth_router)


# Pydantic models
class JobCreate(BaseModel):
    title: str
    description: str
    skills_required: List[str]
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    location: Optional[str] = None
    job_type: str = "full-time"
    experience_level: str = "mid"
    company_name: Optional[str] = None
    benefits: Optional[List[str]] = None
    remote_ok: bool = False
    application_deadline: Optional[datetime] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    skills_required: Optional[List[str]] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    experience_level: Optional[str] = None
    company_name: Optional[str] = None
    benefits: Optional[List[str]] = None
    status: Optional[str] = None
    remote_ok: Optional[bool] = None
    application_deadline: Optional[datetime] = None

class ApplicationUpdate(BaseModel):
    status: str
    recruiter_notes: Optional[str] = None
    rating: Optional[int] = None
    feedback: Optional[str] = None

class InterviewCreate(BaseModel):
    application_id: str
    scheduled_at: datetime
    duration_minutes: int = 60
    meeting_link: Optional[str] = None
    notes: Optional[str] = None

class MessageCreate(BaseModel):
    application_id: str
    receiver_id: str
    message: str



# Jobs endpoints
@app.get("/api/jobs")
async def get_jobs(
    search: Optional[str] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    remote_ok: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0
):
    """Get all jobs with optional filtering"""
    query = supabase.table("jobs").select("*, profiles!recruiter_id(full_name, company_name)")
    
    # Apply filters
    if search:
        query = query.ilike("title", f"%{search}%")
    if location:
        query = query.ilike("location", f"%{location}%")
    if job_type:
        query = query.eq("job_type", job_type)
    if experience_level:
        query = query.eq("experience_level", experience_level)
    if remote_ok is not None:
        query = query.eq("remote_ok", remote_ok)
    
    # Only show open jobs
    query = query.eq("status", "open")
    
    # Pagination and ordering
    query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
    
    result = query.execute()
    return {"jobs": result.data, "count": len(result.data)}

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    """Get job details by ID"""
    result = supabase.table("jobs").select("*, profiles!recruiter_id(full_name, company_name, email)").eq("id", job_id).single().execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return result.data

@app.post("/api/jobs")
async def create_job(job: JobCreate, current_user = Depends(get_current_user)):
    """Create a new job posting"""
    job_data = job.dict()
    job_data["recruiter_id"] = current_user.id
    
    result = supabase.table("jobs").insert(job_data).execute()
    return result.data[0]

@app.put("/api/jobs/{job_id}")
async def update_job(job_id: str, job: JobUpdate, current_user = Depends(get_current_user)):
    """Update a job posting"""
    # Verify ownership
    existing = supabase.table("jobs").select("recruiter_id").eq("id", job_id).single().execute()
    if not existing.data or existing.data["recruiter_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    job_data = {k: v for k, v in job.dict().items() if v is not None}
    result = supabase.table("jobs").update(job_data).eq("id", job_id).execute()
    return result.data[0]

@app.delete("/api/jobs/{job_id}")
async def delete_job(job_id: str, current_user = Depends(get_current_user)):
    """Delete a job posting"""
    # Verify ownership
    existing = supabase.table("jobs").select("recruiter_id").eq("id", job_id).single().execute()
    if not existing.data or existing.data["recruiter_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    supabase.table("jobs").delete().eq("id", job_id).execute()
    return {"message": "Job deleted successfully"}

# Applications endpoints
@app.get("/api/jobs/{job_id}/applications")
async def get_job_applications(job_id: str, current_user = Depends(get_current_user)):
    """Get all applications for a job (recruiter only)"""
    # Verify job ownership
    job = supabase.table("jobs").select("recruiter_id").eq("id", job_id).single().execute()
    if not job.data or job.data["recruiter_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view these applications")
    
    result = supabase.table("applications").select("""
        *, 
        profiles!candidate_id(full_name, email, phone, skills, experience_years, location),
        jobs!job_id(title)
    """).eq("job_id", job_id).order("score", desc=True).execute()
    
    return {"applications": result.data}

@app.get("/api/applications")
async def get_user_applications(current_user = Depends(get_current_user)):
    """Get current user's applications"""
    result = supabase.table("applications").select("""
        *, 
        jobs!job_id(title, company_name, location, profiles!recruiter_id(full_name))
    """).eq("candidate_id", current_user.id).order("created_at", desc=True).execute()
    
    return {"applications": result.data}

@app.put("/api/applications/{application_id}")
async def update_application(
    application_id: str, 
    update: ApplicationUpdate, 
    current_user = Depends(get_current_user)
):
    """Update application status (recruiter only)"""
    # Verify the recruiter owns the job
    app = supabase.table("applications").select("job_id, jobs!job_id(recruiter_id)").eq("id", application_id).single().execute()
    if not app.data or app.data["jobs"]["recruiter_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this application")
    
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    result = supabase.table("applications").update(update_data).eq("id", application_id).execute()
    return result.data[0]

# Interviews endpoints
@app.post("/api/interviews")
async def create_interview(interview: InterviewCreate, current_user = Depends(get_current_user)):
    """Schedule an interview"""
    # Get application details
    app = supabase.table("applications").select("candidate_id, job_id, jobs!job_id(recruiter_id)").eq("id", interview.application_id).single().execute()
    if not app.data or app.data["jobs"]["recruiter_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to schedule interview for this application")
    
    interview_data = interview.dict()
    interview_data["recruiter_id"] = current_user.id
    interview_data["candidate_id"] = app.data["candidate_id"]
    
    result = supabase.table("interviews").insert(interview_data).execute()
    return result.data[0]

@app.get("/api/interviews")
async def get_interviews(current_user = Depends(get_current_user)):
    """Get user's interviews"""
    result = supabase.table("interviews").select("""
        *,
        applications!application_id(jobs!job_id(title)),
        profiles!candidate_id(full_name, email),
        profiles!recruiter_id(full_name, company_name)
    """).or_(f"recruiter_id.eq.{current_user.id},candidate_id.eq.{current_user.id}").order("scheduled_at").execute()
    
    return {"interviews": result.data}

# Messages endpoints
@app.post("/api/messages")
async def send_message(message: MessageCreate, current_user = Depends(get_current_user)):
    """Send a message"""
    message_data = message.dict()
    message_data["sender_id"] = current_user.id
    
    result = supabase.table("messages").insert(message_data).execute()
    return result.data[0]

@app.get("/api/applications/{application_id}/messages")
async def get_application_messages(application_id: str, current_user = Depends(get_current_user)):
    """Get messages for an application"""
    # Verify user is involved in the application
    app = supabase.table("applications").select("candidate_id, jobs!job_id(recruiter_id)").eq("id", application_id).single().execute()
    if not app.data:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if current_user.id not in [app.data["candidate_id"], app.data["jobs"]["recruiter_id"]]:
        raise HTTPException(status_code=403, detail="Not authorized to view these messages")
    
    result = supabase.table("messages").select("""
        *,
        profiles!sender_id(full_name)
    """).eq("application_id", application_id).order("created_at").execute()
    
    return {"messages": result.data}

# Saved jobs endpoints
@app.post("/api/jobs/{job_id}/save")
async def save_job(job_id: str, current_user = Depends(get_current_user)):
    """Save a job"""
    try:
        result = supabase.table("saved_jobs").insert({
            "candidate_id": current_user.id,
            "job_id": job_id
        }).execute()
        return {"message": "Job saved successfully"}
    except Exception as e:
        if "duplicate key" in str(e):
            raise HTTPException(status_code=400, detail="Job already saved")
        raise HTTPException(status_code=500, detail="Failed to save job")

@app.delete("/api/jobs/{job_id}/save")
async def unsave_job(job_id: str, current_user = Depends(get_current_user)):
    """Remove saved job"""
    supabase.table("saved_jobs").delete().eq("candidate_id", current_user.id).eq("job_id", job_id).execute()
    return {"message": "Job removed from saved"}

@app.get("/api/saved-jobs")
async def get_saved_jobs(current_user = Depends(get_current_user)):
    """Get user's saved jobs"""
    result = supabase.table("saved_jobs").select("""
        *,
        jobs!job_id(*, profiles!recruiter_id(full_name, company_name))
    """).eq("candidate_id", current_user.id).order("created_at", desc=True).execute()
    
    return {"saved_jobs": result.data}

# Analytics endpoints
@app.get("/api/analytics/recruiter")
async def get_recruiter_analytics(current_user = Depends(get_current_user)):
    """Get recruiter analytics"""
    # Get job stats
    jobs = supabase.table("jobs").select("id, status").eq("recruiter_id", current_user.id).execute()
    
    # Get application stats
    applications = supabase.table("applications").select("""
        status, created_at,
        jobs!job_id(recruiter_id)
    """).execute()
    
    # Filter applications for this recruiter's jobs
    recruiter_apps = [app for app in applications.data if app["jobs"]["recruiter_id"] == current_user.id]
    
    stats = {
        "total_jobs": len(jobs.data),
        "active_jobs": len([j for j in jobs.data if j["status"] == "open"]),
        "total_applications": len(recruiter_apps),
        "pending_applications": len([a for a in recruiter_apps if a["status"] == "submitted"]),
        "accepted_applications": len([a for a in recruiter_apps if a["status"] == "accepted"]),
        "rejected_applications": len([a for a in recruiter_apps if a["status"] == "rejected"])
    }
    
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)