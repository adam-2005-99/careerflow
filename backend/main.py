from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, status
from pydantic import BaseModel
from typing import Optional

from fastapi import FastAPI, status, HTTPException


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobApplication(BaseModel):
    company: str
    role: str
    status: str = "Applied"
    location: Optional[str] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None


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
    

applications = []

class JobApplication(JobApplicationCreate):
    id: int


@app.get("/")
def root():
    return {"message": "CareerFlow API is running"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post(
    "/api/applications",
    status_code=status.HTTP_201_CREATED,
    response_model=JobApplication,
)
def create_application(application: JobApplicationCreate):
    new_application = JobApplication(
        id=len(applications) + 1,
        **application.model_dump()
    )

    applications.append(new_application)
    return new_application


@app.get(
    "/api/applications",
    response_model=list[JobApplication],
)
def get_applications():
    return applications

@app.get(
    "/api/applications/{application_id}",
    response_model=JobApplication,
)
def get_application(application_id: int):
    for application in applications:
        if application.id == application_id:
            return application

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Application not found"
    ) 


@app.patch(
    "/api/applications/{application_id}",
    response_model=JobApplication,
)
def update_application(
    application_id: int,
    update: JobApplicationUpdate
):
    for index, application in enumerate(applications):
        if application.id == application_id:

            update_data = update.model_dump(exclude_unset=True)

            updated_application = application.model_copy(
                update=update_data
            )

            applications[index] = updated_application

            return updated_application

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Application not found"
    )
    
    

@app.delete(
    "/api/applications/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(application_id: int):
    for index, application in enumerate(applications):
        if application.id == application_id:
            applications.pop(index)
            return

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Application not found"
    )