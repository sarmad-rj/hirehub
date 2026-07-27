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
