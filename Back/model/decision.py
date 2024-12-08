from sqlmodel import Field, SQLModel


class DecisionBase(SQLModel):
    option1: str
    option2: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "option1": "Opción A",
                "option2": "Opción B"
            }
        }


class Decision(DecisionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class DecisionCreate(DecisionBase):
    pass


class DecisionRead(DecisionBase):
    id: int
    option1: str
    option2: str 


class DecisionUpdate(SQLModel):
    option1: str | None = None
    option2: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "option1": "Opción A actualizada",
                "option2": "Opción B actualizada"
            }
        }
