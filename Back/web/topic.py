from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from database import get_session
from errors import Duplicate, Missing
from model.topic import TopicCreate, TopicRead, TopicUpdate
from service.topic import (
    create_topic,
    delete_topic,
    read_topic,
    read_topics,
    update_topic,
)

router = APIRouter()


@router.get("", summary="Consulta todos los temas", response_model=list[TopicRead])
def get_all_topics(db: Session = Depends(get_session)):
    return read_topics(db)


@router.get("/{id}", summary="Consulta un tema por ID", response_model=TopicRead)
def get_a_topic(id: int, db: Session = Depends(get_session)):
    try:
        topic = read_topic(id, db)
        return topic
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post(
    "",
    response_model=TopicRead,
    summary="Crea un tema",
    status_code=status.HTTP_201_CREATED,
)
def create_a_topic(topic: TopicCreate, db: Session = Depends(get_session)):
    try:
        return create_topic(topic=topic, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.patch(
    "/{id}", summary="Actualiza los datos de un tema por ID", response_model=TopicRead
)
def update_a_topic(id: int, topic: TopicUpdate, db: Session = Depends(get_session)):
    try:
        return update_topic(id, topic, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.delete("/{id}", summary="Elimina un tema por ID")
def delete_a_topic(id: int, db: Session = Depends(get_session)):
    try:
        return delete_topic(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
