from pydantic import BaseModel, ConfigDict, Field
from app.tasks.schemas import TaskOut


class ColumnCreate(BaseModel):
    name: str = Field(min_length=1)


class ColumnOut(BaseModel):
    id: int
    name: str
    position: int
    tasks: list[TaskOut] = []  
    model_config = ConfigDict(from_attributes=True)

class ColumnUpdate(BaseModel):
    id: int | None = None
    name: str = Field(min_length=1)

class BoardCreate(BaseModel):
    name: str = Field(min_length = 1)
    owner_id: int #temporal
    columns: list[ColumnCreate] = [] 

class BoardUpdate(BaseModel):
    name: str = Field(min_length=1)
    columns: list[ColumnUpdate] | None = None

class BoardOut(BaseModel):
    id: int
    name: str
    owner_id: int
    model_config = ConfigDict(from_attributes=True)

class BoardDetail(BoardOut):         
    columns: list[ColumnOut] = []   