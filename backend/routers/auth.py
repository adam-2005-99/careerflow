from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import UserCreate, UserResponse, UserLogin
from security import hash_password, verify_password, create_access_token
from dependencies import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    hashed_password = hash_password(user.password)

    new_user = models.User(
        email=user.email,
        password_hash=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user



@router.post("/login")
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(
        models.User.email == credentials.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        credentials.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    
    access_token = create_access_token(
        {"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
    
    

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: models.User = Depends(get_current_user),
):
    return current_user