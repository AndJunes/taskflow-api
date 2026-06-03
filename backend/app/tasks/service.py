from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.tasks.models import Task, Subtask
from app.boards.models import BoardColumn
from app.tasks import schemas


def get_task(db: Session, task_id: int) -> Task | None:
    return db.get(Task, task_id)


def column_exists(db: Session, column_id: int) -> bool:
    return db.get(BoardColumn, column_id) is not None


def create_task(db: Session, data: schemas.TaskCreate) -> Task:
   
    count = db.scalar(
        select(func.count()).select_from(Task).where(Task.column_id == data.column_id)
    )
    task = Task(
        title=data.title,
        description=data.description,
        column_id=data.column_id,
        position=count,
    )
    for sub in data.subtasks:
        task.subtasks.append(Subtask(title=sub.title))
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, data: schemas.TaskUpdate) -> Task:
    task.title = data.title
    task.description = data.description
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()