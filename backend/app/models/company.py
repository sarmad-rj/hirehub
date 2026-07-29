from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    employer = relationship("User", back_populates="company")
    job_listings = relationship("JobListing", back_populates="company")
