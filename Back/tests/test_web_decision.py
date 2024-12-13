import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.decision import Decision

TEST_DECISION = {
    "id": 1,
    "option1": "Test option 1",
    "option2": "Test option 2",
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
    response = client.post("/decision/", json=TEST_DECISION)
    assert response.status_code == 201
    data = response.json()
    assert data["option1"] == TEST_DECISION["option1"]
    assert data["option2"] == TEST_DECISION["option2"]

def test_read_decision(client: TestClient, session: Session):
    decision = Decision(**TEST_DECISION)
    session.add(decision)
    session.commit()

    response = client.get(f"/decision/{decision.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["option1"] == TEST_DECISION["option1"]
    assert data["option2"] == TEST_DECISION["option2"]

def test_update_decision(client: TestClient, session: Session):
    decision = Decision(**TEST_DECISION)
    session.add(decision)
    session.commit()

    updated_data = {
        "option1": "updated@example.com",
        "option2": "2",
    }

    response = client.patch(f"/decision/{decision.id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    assert data["option1"] == updated_data["option1"]
    assert data["option2"] == updated_data["option2"]

def test_delete_decision(client: TestClient, session: Session):
    decision = Decision(**TEST_DECISION)
    session.add(decision)
    session.commit()

    response = client.delete(f"/decision/{decision.id}")
    assert response.status_code == 200

    response = client.get(f"/decision/{decision.id}")
    assert response.status_code == 404