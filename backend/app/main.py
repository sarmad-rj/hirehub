from fastapi import FastAPI
from .database import engine, Base
from .routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireHub API")

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Testing"}
