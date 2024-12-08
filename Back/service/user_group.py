from typing import Sequence
from fastapi import Depends
from sqlmodel import Session, select
from sqlalchemy import func

from database import get_session
from errors import Duplicate, Missing
from model.user_group import UserGroup, UserGroupCreate, UserGroupUpdate, UserGroupAssign



def read_user_groups(db: Session = Depends(get_session)) -> Sequence[UserGroup]:
    user_groups = db.exec(select(UserGroup)).all()
    return user_groups


def read_user_group(id: int, db: Session = Depends(get_session)) -> UserGroup:
    user_group = db.get(UserGroup, id)

    if not user_group:
        raise Missing("Este grupo de usuario no está registrado")

    return user_group


def create_user_group(user_group: UserGroupCreate, db: Session = Depends(get_session)) -> UserGroup:
    
    statement = select(UserGroup).where(
        (UserGroup.user_email == user_group.user_email) & 
        (UserGroup.topic == user_group.topic) & 
        (UserGroup.team == user_group.team)
    )
    existing_user_group = db.exec(statement).first()

    if existing_user_group:
        raise Duplicate("Este usuario ya tiene asignado este tema y equipo")

    user_group_to_db = UserGroup.model_validate(user_group)

    db.add(user_group_to_db)
    db.commit()
    db.refresh(user_group_to_db)
    return user_group_to_db


def update_user_group(id: int, user_group: UserGroupUpdate, db: Session = Depends(get_session)):
    user_group_to_update = db.get(UserGroup, id)

    if not user_group_to_update:
        raise Missing("Este grupo de usuario no está registrado")

    statement = select(UserGroup).where(
        (UserGroup.user_email == user_group.user_email) & 
        (UserGroup.topic == user_group.topic) & 
        (UserGroup.team == user_group.team) &
        (UserGroup.id != id)  
    )
    existing_user_group = db.exec(statement).first()

    if existing_user_group:
        raise Duplicate("Otro usuario ya está asignado a este equipo y tema")

    user_group_data = user_group.model_dump(exclude_unset=True)
    for key, value in user_group_data.items():
        setattr(user_group_to_update, key, value)

    db.add(user_group_to_update)
    db.commit()
    db.refresh(user_group_to_update)
    return user_group_to_update

def delete_user_group(email: str, topic: str, team: str, db: Session = Depends(get_session)):
    user_group = db.get(UserGroup, (email, topic, team))

    if not user_group:
        raise Missing("Este grupo de usuario no está registrado")

    db.delete(user_group)
    db.commit()

    return {"ok": True}

def delete_user_group(id: int, db: Session = Depends(get_session)):
    user_group = db.get(UserGroup, id)

    if not user_group:
        raise Missing("Este grupo de usuario no está registrado")

    db.delete(user_group)
    db.commit()

    return {"ok": True}


def assign_user_group(user_email: str, db: Session) -> UserGroup:
    existing_user_group = db.exec(
        select(UserGroup).where(UserGroup.user_email == user_email)
    ).first()

    if existing_user_group:
        return existing_user_group

    single_member_teams = db.exec(
        select(UserGroup.team).group_by(UserGroup.team).having(func.count(UserGroup.team) == 1)
    ).all()

    if single_member_teams:
        team = single_member_teams[0][0]
    else:
        total_teams = db.exec(select(func.count(func.distinct(UserGroup.team)))).one()
        team = f"Equipo {total_teams[0] + 1}"

    user_group = UserGroup(user_email=user_email, topic="Cambio climático", team=team)
    db.add(user_group)
    db.commit()
    db.refresh(user_group)

    return user_group
