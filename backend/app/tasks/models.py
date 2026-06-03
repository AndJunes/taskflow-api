from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[str] = mapped_column(default="")
    position: Mapped[int]
    column_id: Mapped[int] = mapped_column(ForeignKey("board_columns.id"))

    column: Mapped["BoardColumn"] = relationship(back_populates="tasks")
    subtasks: Mapped[list["Subtask"]] = relationship(
        back_populates="task", cascade="all, delete-orphan"
    )


class Subtask(Base):
    __tablename__ = "subtasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    is_completed: Mapped[bool] = mapped_column(default=False)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"))

    task: Mapped["Task"] = relationship(back_populates="subtasks")