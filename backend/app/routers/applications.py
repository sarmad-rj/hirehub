import os
import shutil
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Application, JobListing, User, UserRole, ApplicationStatus
from ..schemas import ApplicationResponse, ApplicationStatusUpdate
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/applications", tags=["Applications"])

load_dotenv()

UPLOAD_DIR = os.getenv("UPLOAD_DIR")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_job(
    job_id: int = Form(...),
    cover_letter: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SEEKER)),
):
    job = db.query(JobListing).filter(JobListing.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing_app = (
        db.query(Application)
        .filter(Application.job_id == job_id, Application.seeker_id == current_user.id)
        .first()
    )
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    resume_path = None
    if resume:
        if not resume.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed for resumes")

        file_filename = f"user_{current_user.id}_job_{job_id}_{resume.filename}"
        resume_path = os.path.join(UPLOAD_DIR, file_filename)

        with open(resume_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

    new_app = Application(
        job_id=job_id,
        seeker_id=current_user.id,
        resume_url=resume_path,
        cover_letter=cover_letter,
        status=ApplicationStatus.APPLIED,
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    res = ApplicationResponse.model_validate(new_app)
    res.job_title = job.title
    return res


@router.get("/me", response_model=List[ApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SEEKER)),
):
    apps = db.query(Application).filter(Application.seeker_id == current_user.id).all()
    results = []
    for app in apps:
        res = ApplicationResponse.model_validate(app)
        if app.job:
            res.job_title = app.job.title
        results.append(res)
    return results


@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def get_job_applicants(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.EMPLOYER)),
):
    job = db.query(JobListing).filter(JobListing.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    apps = db.query(Application).filter(Application.job_id == job_id).all()
    results = []
    for app in apps:
        res = ApplicationResponse.model_validate(app)
        res.job_title = job.title
        results.append(res)
    return results


@router.patch("/{app_id}/status", response_model=ApplicationResponse)
def update_application_status(
    app_id: int,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.EMPLOYER)),
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = status_update.status
    db.commit()
    db.refresh(app)

    res = ApplicationResponse.model_validate(app)
    if app.job:
        res.job_title = app.job.title
    return res
