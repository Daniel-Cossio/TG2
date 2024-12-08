from sqlmodel import Field, SQLModel

class TopicBase(SQLModel):
    title: str
    description: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Cambio climatico",
                "description": "Explorar los eventos y consecuencias del cambio climático."
            }
        }

class Topic(TopicBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class TopicCreate(TopicBase):
    pass

class TopicRead(TopicBase):
    id: int

class TopicUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
