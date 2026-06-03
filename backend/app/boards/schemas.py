from pydantic import BaseModel, ConfigDict
from app.tasks.schemas import TaskOut


class ColumnCreate(BaseModel):
    name: str


class ColumnOut(BaseModel):
    id: int
    name: str
    position: int
    tasks: list[TaskOut] = []  
    model_config = ConfigDict(from_attributes=True)

class ColumnUpdate(BaseModel):
    id: int | None = None
    name: str

class BoardCreate(BaseModel):
    name: str
    owner_id: int #temporal
    columns: list[ColumnCreate] = [] 

class BoardUpdate(BaseModel):
    name: str
    columns: list[ColumnUpdate] | None = None

class BoardOut(BaseModel):
    id: int
    name: str
    owner_id: int
    model_config = ConfigDict(from_attributes=True)

class BoardDetail(BoardOut):         
    columns: list[ColumnOut] = []   