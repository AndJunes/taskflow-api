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

    if data.columns is not None:
        existing = {c.id: c for c in board.columns}
        incoming_ids = {c.id for c in data.columns if c.id is not None}

        for col_id, col in existing.items():
            if col_id not in incoming_ids:
                db.delete(col)

        for index, col_data in enumerate(data.columns):
            if col_data.id is not None and col_data.id in existing:
                col = existing[col_data.id]
                col.name = col_data.name
                col.position = index
            else:
                board.columns.append(BoardColumn(name=col_data.name, position=index))

    db.commit()
    db.refresh(board)
    return board

def delete_board(db: Session, board: Board) -> None:
    db.delete(board)
    db.commit

def user_exists(db: Session, user_id: int) -> bool:
    return db.get(User, user_id) is not None