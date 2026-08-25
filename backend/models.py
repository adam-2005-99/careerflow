from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base


class JobApplication(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, default="Applied")
    location = Column(String, nullable=True)
    job_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"),nullable=False)
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)