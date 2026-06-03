from pydantic import BaseModel, ConfigDict

class ColumnCreate(BaseModel):
    name: str


class ColumnOut(BaseModel):
    id: int
    name: str
    position: int
    model_config = ConfigDict(from_attributes=True)

class BoardCreate(BaseModel):
    name: str
    owner_id: int #temporal
    columns: list[ColumnCreate] = [] 

class BoardUpdate(BaseModel):
    name: str

class BoardOut(BaseModel):
    id: int
    name: str
    owner_id: int
    model_config = ConfigDict(from_attributes=True)

class BoardDetail(BoardOut):         
    columns: list[ColumnOut] = []   