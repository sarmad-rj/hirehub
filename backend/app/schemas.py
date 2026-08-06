from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from .models import UserRole, ApplicationStatus


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole = UserRole.SEEKER


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    role: UserRole



class CompanyCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CompanyResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True



class JobCreate(BaseModel):
    title: str
    description: str
    location: str
    salary_range: Optional[str] = None
    employment_type: str = "Full-time"


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    salary_range: Optional[str]
    employment_type: str
    company_id: int
    created_at: datetime
    company_name: Optional[str] = None

    class Config:
        from_attributes = True



class ApplicationCreate(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    seeker_id: int
    resume_url: Optional[str]
    cover_letter: Optional[str]
    status: ApplicationStatus
    applied_at: datetime
    job_title: Optional[str] = None

    class Config:
        from_attributes = True

class GoogleLoginRequest(BaseModel):
    id_token: str
    role: Optional[UserRole] = UserRole.SEEKER
    