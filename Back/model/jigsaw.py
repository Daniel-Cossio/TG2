from sqlmodel import Field, SQLModel, UniqueConstraint


class JigsawBase(SQLModel):
    user_email: str
    question_number: int
    answer_text: str

    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "user@email.com",
                "question_number": 1,
                "answer_text": "respuesta"
            }
        }


class Jigsaw(JigsawBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    __table_args__ = (UniqueConstraint("user_email", "question_number"),)

class JigsawCreate(JigsawBase):
    class Config:
        json_schema_extra = {
           "example": {
                "user_email": "user@email.com",
                "question_number": 1,
                "answer_text": "respuesta"
            }
        }


class JigsawUpdate(JigsawBase):
    answer_text: str

    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "user@email.com",
                "question_number": 1,
                "answer_text": "respuesta"
            }
        }


class JigsawRead(JigsawBase):
    user_email: str
    question_number: int
    answer_text: str

