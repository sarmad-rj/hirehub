from fastapi import FastAPI
from .database import engine, Base
from . import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireHub API")

@app.get("/")
def read_root():
    return {"message": "Testing"}
