from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
from .enums import ApplicationStatus


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_listings.id"), nullable=False)
    seeker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_url = Column(String, nullable=True)
    cover_letter = Column(Text, nullable=True)
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.APPLIED, nullable=False)
    applied_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("JobListing", back_populates="applications")
    seeker = relationship("User", back_populates="applications")
