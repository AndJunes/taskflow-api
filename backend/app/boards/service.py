from sqlalchemy import select
from sqlachemy import Session

from app.boards.models import Board
from app.users.models import User
from app.boards import schemas

def list_boards(db: Session):
    return db.scalars(select(Board)).all()

def get_boar(db: Session, board_id: int) -> Board | None:
    return db.get(Board, board_id)

def create_board(db: Session, data: schemas.BoardCreate) -> Board:
    board = Board(**data.model_dump())
    db.add(board)
    db.commit()
    db.refresh(board)
    return board

def update_board(db: Session, board: Board, data: schemas.BoardUpdate) -> Board:
    board.name = data.name
    db.commit()
    db.refresh(board)
    return board

def delete_board(db: Session, board: Board) -> None:
    db.delete(board)
    db.commit

def user_exists(db: Session, user_id: int) -> bool:
    return db.get(User, user_id) is not None