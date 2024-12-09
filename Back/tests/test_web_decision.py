import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.decision import Decision

TEST_DECISION = {
    "user_email": "test@example.com",
    "activity_id": 1,
    "question_number": 1,
    "answer_text": "Test answer",
    "comment": "Test comment"
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

def test_create_decision(client: TestClient):
    response = client.post("/decisions/", json=TEST_DECISION)
    assert response.status_code == 200
    data = response.json()
    assert data["user_email"] == TEST_DECISION["user_email"]
    assert data["activity_id"] == TEST_DECISION["activity_id"]
    assert data["question_number"] == TEST_DECISION["question_number"]
    assert data["answer_text"] == TEST_DECISION["answer_text"]
    assert data["comment"] == TEST_DECISION["comment"]

def test_read_decision(client: TestClient, session: Session):
    decision = Decision(**TEST_DECISION)
    session.add(decision)
    session.commit()

    response = client.get(f"/decisions/{decision.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["user_email"] == TEST_DECISION["user_email"]
    assert data["activity_id"] == TEST_DECISION["activity_id"]
    assert data["question_number"] == TEST_DECISION["question_number"]
    assert data["answer_text"] == TEST_DECISION["answer_text"]
    assert data["comment"] == TEST_DECISION["comment"]

def test_update_decision(client: TestClient, session: Session):
    decision = Decision(**TEST_DECISION)
    session.add(decision)
    session.commit()

    updated_data = {
        "user_email": "updated@example.com",
        "activity_id": 2,
        "question_number": 2,
        "answer_text": "Updated answer",
        "comment": "Updated comment"
    }

    response = client.put(f"/decisions/{decision.id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    assert data["user_email"] == updated_data["user_email"]
    assert data["activity_id"] == updated_data["activity_id"]
    assert data["question_number"] == updated_data["question_number"]
    assert data["answer_text"] == updated_data["answer_text"]
    assert data["comment"] == updated_data["comment"]

def test_delete_decision(client: TestClient, session: Session):
    decision = Decision(**TEST_DECISION)
    session.add(decision)
    session.commit()

    response = client.delete(f"/decisions/{decision.id}")
    assert response.status_code == 200

    response = client.get(f"/decisions/{decision.id}")
    assert response.status_code == 404