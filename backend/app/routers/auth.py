from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Company, UserRole
from ..schemas import UserCreate, UserResponse, Token, GoogleLoginRequest
from ..services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_pwd = AuthService.hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        role=user_data.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if new_user.role == UserRole.EMPLOYER:
        company_name = f"{new_user.email.split('@')[0].capitalize()} Company"
        new_company = Company(name=company_name, employer_id=new_user.id)
        db.add(new_company)
        db.commit()

    return new_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not AuthService.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = AuthService.create_access_token(
        data={"sub": user.email, "role": user.role.value}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
    }

@router.post("/google", response_model=Token)
def google_auth(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Authenticates user via Google SSO token."""
    google_data = AuthService.verify_google_token(payload.id_token)
    if not google_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google token",
        )

    if not google_data.get("email"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided by Google",
        )

    user = AuthService.authenticate_google_user(db, google_data, payload.role)

    access_token = AuthService.create_access_token(
        data={"sub": user.email, "role": user.role.value}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
    }
