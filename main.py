from fastapi import FastAPI

app = FastAPI(
    title = "TaskFlow API",
    description = "Task and project management backend with AI features. ",
    version = "0.1.0",
)

@app.get("/")
def root():
    return{"messsage": "Hello, Taskflow!", "status": "alive"}

@app.get("/health")
def health_check():
    return {"status":"healthy"}