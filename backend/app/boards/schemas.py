from pydantic import BaseModel, ConfigDict

class BoardCreate(BaseModel):
    name: str
    owner_id: int #temporal

class BoardUpdate(BaseModel):
    name: str

class BoardOut(BaseModel):
    id: int
    name: str
    owner_id: int
    model_config = ConfigDict(from_attributes=True)