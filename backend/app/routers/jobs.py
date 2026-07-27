from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import JobListing, Company, User, UserRole
from ..schemas import JobCreate, JobResponse
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.EMPLOYER)),
):
    company = db.query(Company).filter(Company.employer_id == current_user.id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employer does not have a registered profile.",
        )

    new_job = JobListing(
        title=job_data.title,
        description=job_data.description,
        location=job_data.location,
        salary_range=job_data.salary_range,
        employment_type=job_data.employment_type,
        company_id=company.id,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    response = JobResponse.model_validate(new_job)
    response.company_name = company.name
    return response


@router.get("/", response_model=List[JobResponse])
def get_jobs(
    search: Optional[str] = Query(None, description="Search by title or location"),
    employment_type: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(JobListing)

    if search:
        query = query.filter(
            (JobListing.title.ilike(f"%{search}%")) | (JobListing.location.ilike(f"%{search}%"))
        )

    if employment_type:
        query = query.filter(JobListing.employment_type == employment_type)

    jobs = query.offset(skip).limit(limit).all()

    result = []
    for job in jobs:
        res = JobResponse.model_validate(job)
        if job.company:
            res.company_name = job.company.name
        result.append(res)

    return result


@router.get("/{job_id}", response_model=JobResponse)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobListing).filter(JobListing.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job listing not found")

    res = JobResponse.model_validate(job)
    if job.company:
        res.company_name = job.company.name
    return res
