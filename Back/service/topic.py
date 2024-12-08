from typing import Sequence
from fastapi import Depends
from sqlmodel import Session, select
from database import get_session
from errors import Duplicate, Missing
from model.topic import Topic, TopicCreate, TopicUpdate

def read_topics(db: Session = Depends(get_session)) -> Sequence[Topic]:
    topics = db.exec(select(Topic)).all()
    return topics

def read_topic(id: int, db: Session = Depends(get_session)) -> Topic:
    topic = db.get(Topic, id)
    if not topic:
        raise Missing("El tema no está registrado")
    return topic
 
def create_topic(topic: TopicCreate, db: Session = Depends(get_session)) -> Topic:
    topic_to_db = Topic.model_validate(topic)
    statement = select(Topic).where(Topic.title == topic.title)
    topic_in_db = db.exec(statement).first()

    if topic_in_db:
        raise Duplicate("Este tema ya está registrado")

    db.add(topic_to_db)
    db.commit()
    db.refresh(topic_to_db)
    return topic_to_db

def update_topic(id: int, topic: TopicUpdate, db: Session = Depends(get_session)):
    topic_to_update = db.get(Topic, id)
    if not topic_to_update:
        raise Missing("El tema no está registrado")

    topic_data = topic.model_dump(exclude_unset=True)
    for key, value in topic_data.items():
        setattr(topic_to_update, key, value)

    db.add(topic_to_update)
    db.commit()
    db.refresh(topic_to_update)
    return topic_to_update

def delete_topic(id: int, db: Session = Depends(get_session)):
    topic = db.get(Topic, id)
    if not topic:
        raise Missing("El tema no está registrado")
    db.delete(topic)
    db.commit()
    return {"ok": True}
