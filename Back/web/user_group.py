from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from errors import Duplicate, Missing
from model.user_group import UserGroupCreate, UserGroupRead, UserGroupUpdate, UserGroupAssign
from service.user_group import (
    create_user_group,
    delete_user_group,
    read_user_group,
    read_user_groups,
    update_user_group,
    assign_user_group
)

router = APIRouter()


@router.get("", summary="Consulta todos los grupos de usuarios", response_model=list[UserGroupRead])
def get_all_user_groups(db: Session = Depends(get_session)):
    return read_user_groups(db)


@router.get("/{id}", summary="Consulta un grupo de usuario por ID", response_model=UserGroupRead)
def get_a_user_group(id: int, db: Session = Depends(get_session)):
    try:
        user_group = read_user_group(id, db)
        return user_group
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post(
    "",
    response_model=UserGroupRead,
    summary="Crea un grupo de usuario",
    status_code=status.HTTP_201_CREATED,
)
def create_a_user_group(user_group: UserGroupCreate, db: Session = Depends(get_session)):
    try:
        return create_user_group(user_group=user_group, db=db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.patch(
    "/{id}", summary="Actualiza los datos de un grupo de usuario por ID", response_model=UserGroupRead
)
def update_a_user_group(id: int, user_group: UserGroupUpdate, db: Session = Depends(get_session)):
    try:
        return update_user_group(id, user_group, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)


@router.delete("/{id}", summary="Elimina un grupo de usuario por ID")
def delete_a_user_group(id: int, db: Session = Depends(get_session)):
    try:
        return delete_user_group(id, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)

@router.delete("/{email}", summary="Elimina un grupo de usuario por email")
def delete_a_user_group(email: str, db: Session = Depends(get_session)):
    try:
        return delete_user_group(email, db)
    except Missing as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.msg)


@router.post(
    "/assign/",
    response_model=UserGroupRead,
    summary="Asigna un usuario a un grupo",
    status_code=status.HTTP_201_CREATED,
)
def assign_an_user_group(user_group: UserGroupAssign, db: Session = Depends(get_session)):
    try:
        return assign_user_group(user_group.user_email, db)
    except Duplicate as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.msg)

