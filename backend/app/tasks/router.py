from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.tasks import schemas, service

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=schemas.TaskOut, status_code=201)
def create_task(data: schemas.TaskCreate, db: Session = Depends(get_db)):
    if not service.column_exists(db, data.column_id):
        raise HTTPException(status_code=404, detail="Column not found")
    return service.create_task(db, data)


@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = service.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, data: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = service.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return service.update_task(db, task, data)


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = service.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    service.delete_task(db, task)