from fastapi import FastAPI

from app.users import models as _user_models
from app.boards import models as _board_models
from app.tasks import models as _task_models

from app.users.router import router as users_router
from app.boards.router import router as boards_router
from app.tasks.router import router as tasks_router



app = FastAPI()

app.include_router(users_router)
app.include_router(boards_router)
app.include_router(tasks_router)