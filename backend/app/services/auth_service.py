from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests

from ..constants import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, GOOGLE_CLIENT_ID
from ..models import User, Company, UserRole

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password[:72])

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password[:72], hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def decode_token(token: str) -> Optional[dict]:
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            return None

    @staticmethod
    def verify_google_token(token: str) -> Optional[dict]:
        """Verifies Google ID Token and returns user payload if valid."""
        try:
            id_info = id_token.verify_oauth2_token(
                token, requests.Request(), GOOGLE_CLIENT_ID, clock_skew_in_seconds=10
            )
            return id_info
        except Exception as e:
            print(f"Google Token Verification Error: {e}")
            return None

    @staticmethod
    def authenticate_google_user(db: Session, google_data: dict, role: Optional[UserRole] = None) -> User:
        """Retrieves an existing Google user or creates a new user and company profile."""
        email = google_data.get("email")
        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(
                email=email,
                hashed_password=AuthService.hash_password("GOOGLE_SSO_USER"),
                role=role or UserRole.SEEKER,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            if user.role == UserRole.EMPLOYER:
                company_name = f"{user.email.split('@')[0].capitalize()} Company"
                new_company = Company(name=company_name, employer_id=user.id)
                db.add(new_company)
                db.commit()

        return user
