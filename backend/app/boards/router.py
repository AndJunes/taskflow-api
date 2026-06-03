from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.boards import schemas, service

router = APIRouter(prefix="/boards", tags=["boards"])


@router.get("/", response_model=list[schemas.BoardOut])
def list_boards(db: Session = Depends(get_db)):
    return service.list_boards(db)


@router.get("/{board_id}", response_model=schemas.BoardDetail)
def get_board(board_id: int, db: Session = Depends(get_db)):
    board = service.get_board(db, board_id)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.post("/", response_model=schemas.BoardDetail, status_code=201)
def create_board(data: schemas.BoardCreate, db: Session = Depends(get_db)):
    if not service.user_exists(db, data.owner_id):
        raise HTTPException(status_code=404, detail="Owner not found")
    return service.create_board(db, data)


@router.put("/{board_id}", response_model=schemas.BoardDetail)
def update_board(board_id: int, data: schemas.BoardUpdate, db: Session = Depends(get_db)):
    board = service.get_board(db, board_id)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return service.update_board(db, board, data)

@router.delete("/{board_id}", status_code=204)
def delete_board(board_id: int, db: Session = Depends(get_db)):
    board = service.get_board(db, board_id)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    service.delete_board(db, board)