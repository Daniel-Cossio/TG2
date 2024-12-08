import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database import get_session
from main import app
from model.course import Course

TEST_COURSE = {
    "content_id": "content id",
    "title": "fake title",
    "category_id": "category id",
    "description": "description",
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


def test_create_course(client: TestClient):
    response = client.post(
        "/courses",
        json=TEST_COURSE,
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["content_id"] == "content id", "ID invalido"
    assert data["title"] == "fake title", "title invalido"
    assert data["category_id"] == "category id", "ID invalido"
    assert data["description"] == "description", "description invalida"


def test_get_course(session: Session, client: TestClient):
    course = Course(**TEST_COURSE)
    session.add(course)
    session.commit()
    response = client.get(f"/courses/{course.id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["content_id"] == "content id", "ID invalido"
    assert data["title"] == "fake title", "title invalido"
    assert data["category_id"] == "category id", "ID invalido"
    assert data["description"] == "description", "description invalida"


def test_get_courses(session: Session, client: TestClient):
    course = Course(**TEST_COURSE)
    session.add(course)
    session.commit()
    response = client.get("/courses")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["content_id"] == "content id", "ID invalido"
    assert data[0]["title"] == "fake title", "title invalido"
    assert data[0]["category_id"] == "category id", "ID invalido"
    assert data[0]["description"] == "description", "description invalida"


def test_get_non_existent_course(client: TestClient):
    response = client.get(f"/courses/123")
    assert response.status_code == 404, response.text


def test_update_course(session: Session, client: TestClient):
    course = Course(**TEST_COURSE)
    session.add(course)
    session.commit()
    updated_course = TEST_COURSE.copy()
    updated_course["description"] = "new description"
    response = client.patch(f"/courses/{course.id}", json=updated_course)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["content_id"] == "content id", "ID invalido"
    assert data["title"] == "fake title", "title invalido"
    assert data["category_id"] == "category id", "ID invalido"
    assert data["description"] == "new description", "description invalida"


def test_delete_course(session: Session, client: TestClient):
    course = Course(**TEST_COURSE)
    session.add(course)
    session.commit()

    response = client.delete(f"/courses/{course.id}")

    course_in_db = session.get(Course, course.id)

    assert response.status_code == 200

    assert course_in_db is None
