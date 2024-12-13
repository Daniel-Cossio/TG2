import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.answer import Answer

TEST_ANSWER = {
    "user_email": "user@email.com",
    "activity_id": "1",
    "question_number": 1,
    "answer_text": "respuesta",
    "rating": 5,
    "comment": "xD"
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


def test_create_answer(client: TestClient):
    response = client.post(
        "/answer",
        json=TEST_ANSWER,
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["user_email"] == "user@email.com", "email erroneo"
    assert data["activity_id"] == "1", "ID invalido"
    assert data["question_number"] == 1, "question_number invalido"
    assert data["answer_text"] == "respuesta", "titulo invalido"


def test_get_answer(session: Session, client: TestClient):
    answer = Answer(**TEST_ANSWER)
    session.add(answer)
    session.commit()
    response = client.get(f"/answer/{answer.id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["user_email"] == "user@email.com", "ID invalido"
    assert data["activity_id"] == "1", "ID invalido"
    assert data["question_number"] == 1, "question_number invalido"
    assert data["answer_text"] == "respuesta", "titulo invalido"


def test_get_answers(session: Session, client: TestClient):
    answer = Answer(**TEST_ANSWER)
    session.add(answer)
    session.commit()
    response = client.get("/answer")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["user_email"] == "user@email.com", "ID invalido"
    assert data[0]["activity_id"] == "1", "ID invalido"
    assert data[0]["question_number"] == 1, "question_number invalido"
    assert data[0]["answer_text"] == "respuesta", "titulo invalido"


def test_get_non_existent_answer(client: TestClient):
    response = client.get(f"/answer/123")
    assert response.status_code == 404, response.text


def test_get_answers_by_activity_user_question(session: Session, client: TestClient):
    answer = Answer(**TEST_ANSWER)
    session.add(answer)
    session.commit()
    response = client.get("/answer/user@email.com/1/1")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["user_email"] == "user@email.com", "ID invalido"
    assert data[0]["activity_id"] == "1", "ID invalido"
    assert data[0]["question_number"] == 1, "question_number invalido"
    assert data[0]["answer_text"] == "respuesta", "titulo invalido"


def test_get_answers_by_activity_user(session: Session, client: TestClient):
    answer = Answer(**TEST_ANSWER)
    session.add(answer)
    session.commit()
    response = client.get("/answer/1/user@email.com")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["user_email"] == "user@email.com", "ID invalido"
    assert data[0]["activity_id"] == "1", "ID invalido"
    assert data[0]["question_number"] == 1, "question_number invalido"
    assert data[0]["answer_text"] == "respuesta", "titulo invalido"


def test_update_answer(session: Session, client: TestClient):
    answer = Answer(**TEST_ANSWER)
    session.add(answer)
    session.commit()
    updated_answer = TEST_ANSWER.copy()
    updated_answer["answer_text"] = "answer_text updated"
    response = client.patch(f"/answer/{answer.id}", json=updated_answer)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["user_email"] == "user@email.com", "ID invalido"
    assert data["activity_id"] == "1", "ID invalido"
    assert data["question_number"] == 1, "question_number invalido"
    assert data["answer_text"] == "answer_text updated", "titulo invalido"


def test_delete_answer(session: Session, client: TestClient):
    answer = Answer(**TEST_ANSWER)
    session.add(answer)
    session.commit()

    response = client.delete(f"/answer/{answer.id}")

    answer_in_db = session.get(Answer, answer.id)

    assert response.status_code == 200

    assert answer_in_db is None
