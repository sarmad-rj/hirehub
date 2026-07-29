import enum


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
