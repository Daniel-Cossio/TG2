from typing import Sequence
from fastapi import Depends
from sqlmodel import Session, select
from database import get_session
from errors import Duplicate, Missing
from model.decision import Decision, DecisionCreate, DecisionUpdate

def read_decisions(db: Session = Depends(get_session)) -> Sequence[Decision]:
    """Obtiene todas las decisiones en la base de datos"""
    decisions = db.exec(select(Decision)).all()
    return decisions

def read_decision(id: int, db: Session = Depends(get_session)) -> Decision:
    """Obtiene una decisión específica por su ID"""
    decision = db.get(Decision, id)
    if not decision:
        raise Missing("Esta decisión no está registrada")
    return decision

def create_decision(decision: DecisionCreate, db: Session = Depends(get_session)) -> Decision:
    """Crea una nueva decisión en la base de datos"""
    decision_to_db = Decision.model_validate(decision)
    statement = select(Decision).where(Decision.option1 == decision.option1)
    decision_in_db = db.exec(statement).first()

    if decision_in_db:
        raise Duplicate("Esta decisión ya está registrada")

    db.add(decision_to_db)
    db.commit()
    db.refresh(decision_to_db)
    return decision_to_db

def update_decision(id: int, decision: DecisionUpdate, db: Session = Depends(get_session)):
    """Actualiza una decisión existente en la base de datos"""
    decision_to_update = db.get(Decision, id)
    if not decision_to_update:
        raise Missing("Esta decisión no está registrada")

    decision_data = decision.model_dump(exclude_unset=True)
    for key, value in decision_data.items():
        setattr(decision_to_update, key, value)

    db.add(decision_to_update)
    db.commit()
    db.refresh(decision_to_update)
    return decision_to_update

def delete_decision(id: int, db: Session = Depends(get_session)):
    """Elimina una decisión de la base de datos"""
    decision = db.get(Decision, id)
    if not decision:
        raise Missing("Esta decisión no está registrada")
    db.delete(decision)
    db.commit()
    return {"ok": True}


def read_random_decision(db: Session = Depends(get_session)) -> Decision:
    """Obtiene una decisión aleatoria de la base de datos"""
    decision = db.exec(select(Decision)).first()
    if not decision:
        raise Missing("No hay decisiones registradas")
    return decision