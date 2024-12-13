import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.topic import Topic

TEST_TOPIC = {
    "title": "Test Topic",
    "description": "Test Description"
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

def test_create_topic(client: TestClient):
    response = client.post("/topic/", json=TEST_TOPIC)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == TEST_TOPIC["title"]
    assert data["description"] == TEST_TOPIC["description"]

def test_read_topic(client: TestClient, session: Session):
    topic = Topic(**TEST_TOPIC)
    session.add(topic)
    session.commit()

    response = client.get(f"/topic/{topic.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == TEST_TOPIC["title"]
    assert data["description"] == TEST_TOPIC["description"]

def test_update_topic(client: TestClient, session: Session):
    topic = Topic(**TEST_TOPIC)
    session.add(topic)
    session.commit()

    updated_data = {
        "title": "Updated Topic",
        "description": "Updated Description"
    }

    response = client.patch(f"/topic/{topic.id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == updated_data["title"]
    assert data["description"] == updated_data["description"]

def test_delete_topic(client: TestClient, session: Session):
    topic = Topic(**TEST_TOPIC)
    session.add(topic)
    session.commit()

    response = client.delete(f"/topic/{topic.id}")
    assert response.status_code == 200

    response = client.get(f"/topic/{topic.id}")
    assert response.status_code == 404