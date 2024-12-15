from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Duplicate, Missing
from model.jigsaw import JigsawRead, JigsawUpdate, JigsawCreate
from service.jigsaw import (create_jigsaw, read_jigsaw,read_jigsaw_by_user_email_and_question_number) 

router = APIRouter()


@router.get("/user/{email}/question/{question_number}", summary="consulta una actividad por correo y numero de pregunta", response_model=JigsawRead)
def get_jigsaw_by_user_email_and_question_number(email: str, question_number: int, db: Session = Depends(get_session)):
    try:
        jigsaw = read_jigsaw_by_user_email_and_question_number(email, question_number, db)
        return jigsaw
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)

@router.post(   
    "/save",
    response_model=JigsawRead,
    summary="crea una respuesta",
    status_code=status.HTTP_201_CREATED,
) 
def create_jigsaw_answer(jigsaw: JigsawCreate, db: Session = Depends(get_session)):
    try:
        return create_jigsaw(jigsaw=jigsaw, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)