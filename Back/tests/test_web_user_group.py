import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.user_group import UserGroup

TEST_USER_GROUP = {
    "user_email": "test@example.com",
    "topic": "Test Topic",
    "team": "Test Team"
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

def test_create_user_group(client: TestClient):
    response = client.post("/user_groups/", json=TEST_USER_GROUP)
    assert response.status_code == 200
    data = response.json()
    assert data["user_email"] == TEST_USER_GROUP["user_email"]
    assert data["topic"] == TEST_USER_GROUP["topic"]
    assert data["team"] == TEST_USER_GROUP["team"]

def test_read_user_group(client: TestClient, session: Session):
    user_group = UserGroup(**TEST_USER_GROUP)
    session.add(user_group)
    session.commit()

    response = client.get(f"/user_groups/{user_group.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["user_email"] == TEST_USER_GROUP["user_email"]
    assert data["topic"] == TEST_USER_GROUP["topic"]
    assert data["team"] == TEST_USER_GROUP["team"]

def test_update_user_group(client: TestClient, session: Session):
    user_group = UserGroup(**TEST_USER_GROUP)
    session.add(user_group)
    session.commit()

    updated_data = {
        "user_email": "updated@example.com",
        "topic": "Updated Topic",
        "team": "Updated Team"
    }

    response = client.put(f"/user_groups/{user_group.id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    assert data["user_email"] == updated_data["user_email"]
    assert data["topic"] == updated_data["topic"]
    assert data["team"] == updated_data["team"]

def test_delete_user_group(client: TestClient, session: Session):
    user_group = UserGroup(**TEST_USER_GROUP)
    session.add(user_group)
    session.commit()

    response = client.delete(f"/user_groups/{user_group.id}")
    assert response.status_code == 200

    response = client.get(f"/user_groups/{user_group.id}")
    assert response.status_code == 404