from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr
from enum import Enum


    
class ApplicationStatus(str, Enum):
    APPLIED = "Applied"
    INTERVIEW = "Interview"
    OFFER = "Offer"
    REJECTED = "Rejected"
    

class JobApplicationCreate(BaseModel):
    company: str
    role: str
    status: ApplicationStatus = ApplicationStatus.APPLIED
    location: Optional[str] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None


class JobApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    location: Optional[str] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None
    


class JobApplication(JobApplicationCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
    

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)
    
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str