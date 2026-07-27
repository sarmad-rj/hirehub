from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import auth, jobs, applications

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireHub API")

# for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1505", "http://127.0.0.1:1505"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)

@app.get("/")
def read_root():
    return {"message": "Testing"}
