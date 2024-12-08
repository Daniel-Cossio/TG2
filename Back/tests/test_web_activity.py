import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.activity import Activity

TEST_ACTIVITY = {
    "id": 1,
    "activity_id": "content id",
    "course_id": "course id",
    "content_type": "std",
    "title": "title",
    "objective": "objective",
    "metodology": "metodology",
    "resources": "resources",
    "introduction": "introduction",
    "analisis": "analisis",
    "evaluation": "evaluation",
    "example": "example",
    "question1": "question1",
    "question2": "question2",
    "question3": "question3",
    "question4": "question4",
    "question5": "question5",
    "path": "/activity/path",
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


def test_create_activity(client: TestClient):
    response = client.post(
        "/activity",
        json=TEST_ACTIVITY,
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["activity_id"] == "content id", "ID invalido"
    assert data["course_id"] == "course id", "ID invalido"
    assert data["content_type"] == "std", "content_type invalido"
    assert data["title"] == "title", "titulo invalido"


def test_get_activities(session: Session, client: TestClient):
    activity = Activity(**TEST_ACTIVITY)
    session.add(activity)
    session.commit()
    response = client.get("/activity")
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data) == 1, "La cantidad de elementos es incorrecta"
    assert data[0]["activity_id"] == "content id", "ID invalido"
    assert data[0]["course_id"] == "course id", "ID invalido"
    assert data[0]["content_type"] == "std", "content_type invalido"
    assert data[0]["title"] == "title", "titulo invalido"


def test_get_activity(session: Session, client: TestClient):
    activity = Activity(**TEST_ACTIVITY)
    session.add(activity)
    session.commit()
    response = client.get(f"/activity/{activity.id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["activity_id"] == "content id", "ID invalido"
    assert data["course_id"] == "course id", "ID invalido"
    assert data["content_type"] == "std", "content_type invalido"
    assert data["title"] == "title", "titulo invalido"


def test_get_activity_by_course(session: Session, client: TestClient):
    activity = TEST_ACTIVITY.copy()
    activity["course_id"] = "10"
    activity = Activity(**activity)
    session.add(activity)
    session.commit()
    response = client.get(f"/activity/course/{activity.course_id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["activity_id"] == "content id", "ID invalido"
    assert data[0]["course_id"] == "10", "ID invalido"
    assert data[0]["content_type"] == "std", "content_type invalido"
    assert data[0]["title"] == "title", "titulo invalido"


def test_get_non_existent_activity(client: TestClient):
    response = client.get(f"/activity/123")
    assert response.status_code == 404, response.text


def test_update_activity(session: Session, client: TestClient):
    activity = Activity(**TEST_ACTIVITY)
    session.add(activity)
    session.commit()
    updated_activity = TEST_ACTIVITY.copy()
    updated_activity["title"] = "title updated"
    response = client.patch(f"/activity/{activity.id}", json=updated_activity)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["activity_id"] == "content id", "ID invalido"
    assert data["course_id"] == "course id", "ID invalido"
    assert data["content_type"] == "std", "content_type invalido"
    assert data["title"] == "title updated", "titulo invalido"


def test_delete_activity(session: Session, client: TestClient):
    activity = Activity(**TEST_ACTIVITY)
    session.add(activity)
    session.commit()

    response = client.delete(f"/activity/{activity.id}")

    activity_in_db = session.get(Activity, activity.id)

    assert response.status_code == 200

    assert activity_in_db is None
