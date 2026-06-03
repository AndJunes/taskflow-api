from pydantic import BaseModel, ConfigDict


class SubtaskCreate(BaseModel):
    title: str


class SubtaskOut(BaseModel):
    id: int
    title: str
    is_completed: bool
    model_config = ConfigDict(from_attributes=True)


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    column_id: int
    subtasks: list[SubtaskCreate] = []


class TaskUpdate(BaseModel):
    title: str
    description: str = ""


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    position: int
    column_id: int
    subtasks: list[SubtaskOut] = []
    model_config = ConfigDict(from_attributes=True)