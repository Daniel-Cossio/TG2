import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.comment import Comment

TEST_COMMENT = {
    "id": 123456,
    "content": "content id",
    "created_at": "esto sera una fecha xD",
    "user_id": "user id",
    "course_id": "1",
}

TEST_COMMENT_2 = {
    "content": "content id",
    "created_at": "esto sera una fecha xD",
    "user_id": "user id",
    "course_id": "1",
}


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_create_comment(client: TestClient):
    response = client.post(
        "/comment",
        json=TEST_COMMENT_2,
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["content"] == "content id", "ID invalido"
    assert data["created_at"] == "esto sera una fecha xD", "invalido"
    assert data["user_id"] == "user id", "ID invalido"
    assert data["course_id"] == "1", "ID invalido"


def test_get_comment(session: Session, client: TestClient):
    comment = Comment(**TEST_COMMENT)
    session.add(comment)
    session.commit()
    response = client.get(f"/comment/{comment.id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["content"] == "content id", "ID invalido"
    assert data["created_at"] == "esto sera una fecha xD", "invalido"
    assert data["user_id"] == "user id", "ID invalido"
    assert data["course_id"] == "1", "ID invalido"


def test_get_comments(session: Session, client: TestClient):
    comment = Comment(**TEST_COMMENT)
    session.add(comment)
    session.commit()
    response = client.get("/comment")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["content"] == "content id", "ID invalido"
    assert data[0]["created_at"] == "esto sera una fecha xD", "invalido"
    assert data[0]["user_id"] == "user id", "ID invalido"
    assert data[0]["course_id"] == "1", "ID invalido"


def test_get_non_existent_comment(client: TestClient):
    response = client.get(f"/comment/123")
    assert response.status_code == 404, response.text


def test_get_comments_by_course(session: Session, client: TestClient):
    comment = Comment(**TEST_COMMENT)
    session.add(comment)
    session.commit()
    response = client.get("/comment/course/1")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["content"] == "content id", "ID invalido"
    assert data[0]["created_at"] == "esto sera una fecha xD", "invalido"
    assert data[0]["user_id"] == "user id", "ID invalido"
    assert data[0]["course_id"] == "1", "ID invalido"


def test_update_comment(session: Session, client: TestClient):
    comment = Comment(**TEST_COMMENT)
    session.add(comment)
    session.commit()
    updated_comment = TEST_COMMENT.copy()
    updated_comment["created_at"] = "03/02/2000"
    response = client.patch(f"/comment/{comment.id}", json=updated_comment)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["content"] == "content id", "ID invalido"
    assert data["created_at"] == "03/02/2000", "invalido"
    assert data["user_id"] == "user id", "ID invalido"
    assert data["course_id"] == "1", "ID invalido"


def test_delete_comment(session: Session, client: TestClient):
    comment = Comment(**TEST_COMMENT)
    session.add(comment)
    session.commit()

    response = client.delete(f"/comment/{comment.id}")

    comment_in_db = session.get(Comment, comment.id)

    assert response.status_code == 200

    assert comment_in_db is None
