from sqlmodel import Field, SQLModel

class UserGroupBase(SQLModel):
    user_email: str
    topic: str
    team: str

    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "fake@email.com",
                "topic": "Tema 1",
                "team": "Equipo A"
            }
        }


class UserGroup(UserGroupBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class UserGroupCreate(UserGroupBase):
    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "fake@email.com",
                "topic": "Tema 1",
                "team": "Equipo A"
            }
        }


class UserGroupRead(UserGroupBase):
    id: int
    user_email: str
    topic: str
    team: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_email": "fake@email.com",
                "topic": "Tema 1",
                "team": "Equipo A"
            }
        }


class UserGroupUpdate(SQLModel):
    user_email: str | None = None
    topic: str | None = None
    team: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "updated@email.com",
                "topic": "Tema 2",
                "team": "Equipo B"
            }
        }

class UserGroupAssign(SQLModel):
    user_email: str

    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "emailAsign@email.com"
            }
        }
        
