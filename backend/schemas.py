from typing import Optional
from pydantic import BaseModel, ConfigDict

class JobApplicationCreate(BaseModel):
    company: str
    role: str
    status: str = "Applied"
    location: Optional[str] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None


class JobApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None
    


class JobApplication(JobApplicationCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)