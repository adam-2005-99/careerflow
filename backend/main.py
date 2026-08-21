from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel, ConfigDict

import models
from database import engine, get_db


models.Base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




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
def create_application(
    application: JobApplicationCreate,
    db: Session = Depends(get_db),
):
    new_application = models.JobApplication(
        **application.model_dump()
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application



@app.get(
    "/api/applications",
    response_model=list[JobApplication],
)
def get_applications(
    db: Session = Depends(get_db),
):
    return db.query(models.JobApplication).all()



@app.get(
    "/api/applications/{application_id}",
    response_model=JobApplication,
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = db.query(models.JobApplication).filter(
        models.JobApplication.id == application_id
    ).first()

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    return application


@app.patch(
    "/api/applications/{application_id}",
    response_model=JobApplication,
)
def update_application(
    application_id: int,
    update: JobApplicationUpdate,
    db: Session = Depends(get_db),
):
    application = db.query(models.JobApplication).filter(
        models.JobApplication.id == application_id
    ).first()

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    update_data = update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(application, key, value)

    db.commit()
    db.refresh(application)

    return application
    
    

@app.delete(
    "/api/applications/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = db.query(models.JobApplication).filter(
        models.JobApplication.id == application_id
    ).first()

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    db.delete(application)
    db.commit()

    return