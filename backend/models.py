from sqlalchemy import Column, Integer, String, Text
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