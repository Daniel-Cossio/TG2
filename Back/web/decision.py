from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from database import get_session
from errors import Duplicate, Missing
from model.decision import DecisionCreate, DecisionRead, DecisionUpdate
import random
from service.decision import (
    create_decision,
    delete_decision,
    read_decision,
    read_decisions,
    update_decision,
    read_random_decision,
)

router = APIRouter()


@router.get("todas", summary="Consulta todas las decisiones", response_model=list[DecisionRead])
def get_all_decisions(db: Session = Depends(get_session)):
    """Endpoint para obtener todas las decisiones"""
    return read_decisions(db)


@router.get("/{id}", summary="Consulta una decisión por ID", response_model=DecisionRead)
def get_a_decision(id: int, db: Session = Depends(get_session)):
    """Endpoint para obtener una decisión por su ID"""
    try:
        decision = read_decision(id, db)
        return decision
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post(
    "",
    response_model=DecisionRead,
    summary="Crea una decisión",
    status_code=status.HTTP_201_CREATED,
)
def create_a_decision(decision: DecisionCreate, db: Session = Depends(get_session)):
    """Endpoint para crear una nueva decisión"""
    try:
        return create_decision(decision=decision, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.patch(
    "/{id}", summary="Actualiza los datos de una decisión por ID", response_model=DecisionRead
)
def update_a_decision(id: int, decision: DecisionUpdate, db: Session = Depends(get_session)):
    """Endpoint para actualizar los datos de una decisión existente"""
    try:
        return update_decision(id, decision, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.delete("/{id}", summary="Elimina una decisión por ID")
def delete_a_decision(id: int, db: Session = Depends(get_session)):
    """Endpoint para eliminar una decisión"""
    try:
        return delete_decision(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)



@router.get("/random/", summary="Consulta una decisión aleatoria", response_model=DecisionRead)
def get_random_decision(db: Session = Depends(get_session)):
    #Generar un número random del 1 al 100 y asignalo en una variable
    random_number = random.randint(1, 100)


    
    decision = read_decision(random_number, db)
    return decision

