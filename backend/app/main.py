import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.users import models as _user_models
from app.boards import models as _board_models
from app.tasks import models as _task_models

from app.users.router import router as users_router
from app.boards.router import router as boards_router
from app.tasks.router import router as tasks_router, subtasks_router



app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(boards_router)
app.include_router(tasks_router)
app.include_router(subtasks_router)