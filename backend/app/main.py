from fastapi import FastAPI

app = FastAPI(title="HireHub API")

@app.get("/")
def read_root():
    return {"message": "Testing"}
