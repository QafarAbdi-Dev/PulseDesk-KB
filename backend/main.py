from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "PulseDesk-KB API is running"}