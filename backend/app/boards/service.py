from sqlalchemy import select
from sqlalchemy.orm import Session

from app.boards.models import Board, BoardColumn
from app.users.models import User
from app.boards import schemas

def list_boards(db: Session):
    return db.scalars(select(Board)).all()

def get_board(db: Session, board_id: int) -> Board | None:
    return db.get(Board, board_id)

def create_board(db: Session, data: schemas.BoardCreate) -> Board:
    board = Board(name=data.name, owner_id=data.owner_id)
    for index, col in enumerate(data.columns):
        board.columns.append(BoardColumn(name=col.name, position=index))
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