from typing import Sequence

from fastapi import Depends
from sqlmodel import Session, select

from database import get_session
from errors import Duplicate, Missing
from model.jigsaw import JigsawRead, JigsawUpdate, JigsawCreate, Jigsaw


def read_jigsaw(db: Session = Depends(get_session)) -> Sequence[Jigsaw]:
    activities = db.exec(select(Jigsaw)).all()
    return activities

def read_jigsaw(id: int, db: Session = Depends(get_session)) -> Jigsaw:
    jigsaw = db.get(Jigsaw, id)

    if not jigsaw:
        raise Missing("Esta respuesta no esta registrado")

    return jigsaw


def create_jigsaw(jigsaw: JigsawCreate, db: Session = Depends(get_session)) -> Jigsaw:
    jigsaw_to_db = Jigsaw.model_validate(jigsaw)
    statement = select(Jigsaw).where(Jigsaw.jigsaw_id == jigsaw.jigsaw_id)
    jigsaw_in_db = db.exec(statement).first()

    if jigsaw_in_db:
        raise Duplicate("Esta respuesta ya esta registrada")

    db.add(jigsaw_to_db)
    db.commit()
    db.refresh(jigsaw_to_db)
    return jigsaw_to_db


def read_jigsaw_by_user_email_and_question_number(user_email: str, question_number: int, db: Session = Depends(get_session)) -> Jigsaw:
    jigsaw = db.exec(select(Jigsaw).where(Jigsaw.user_email == user_email and Jigsaw.question_number == question_number)).first()
    return jigsaw                   