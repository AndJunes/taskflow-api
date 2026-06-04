from pydantic import BaseModel, ConfigDict, Field


class SubtaskCreate(BaseModel):
    title: str = Field(min_length=1)


class SubtaskOut(BaseModel):
    id: int
    title: str
    is_completed: bool
    model_config = ConfigDict(from_attributes=True)

class SubtaskUpdate(BaseModel):
    is_completed: bool

class SubtaskUpsert(BaseModel):       
    id: int | None = None             
    title: str = Field(min_length=1)

class TaskMove(BaseModel):
    column_id: int
    position: int | None = None 

class TaskCreate(BaseModel):
    title: str = Field(min_length=1)
    description: str = ""
    column_id: int
    subtasks: list[SubtaskCreate] = []


class TaskUpdate(BaseModel):
    title: str = Field(min_length=1)
    description: str = ""
    subtasks: list[SubtaskUpsert] | None = None 


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    position: int
    column_id: int
    subtasks: list[SubtaskOut] = []
    model_config = ConfigDict(from_attributes=True)