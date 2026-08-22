from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import JobApplication, JobApplicationCreate, JobApplicationUpdate


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"],
)


@router.post(
    "/",
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



@router.get(
    "/",
    response_model=list[JobApplication],
)
def get_applications(
    db: Session = Depends(get_db),
):
    return db.query(models.JobApplication).all()



@router.get(
    "/{application_id}",
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


@router.patch(
    "/{application_id}",
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
    
    

@router.delete(
    "/{application_id}",
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