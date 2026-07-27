import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class UserRole(str, enum.Enum):
    SEEKER = "seeker"
    EMPLOYER = "employer"
    ADMIN = "admin"


class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    REVIEWED = "reviewed"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.SEEKER, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="employer", uselist=False)
    applications = relationship("Application", back_populates="seeker")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    employer = relationship("User", back_populates="company")
    job_listings = relationship("JobListing", back_populates="company")


class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False, index=True)
    salary_range = Column(String, nullable=True)
    employment_type = Column(String, nullable=False, default="Full-time")  
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="job_listings")
    applications = relationship("Application", back_populates="job")


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
