from fastapi import FastAPI

from . import models
from .routers import users


app = FastAPI()

app.include_router(users.router)
