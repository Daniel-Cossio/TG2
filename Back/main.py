from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import create_db_and_tables
from utils.logger import logger_config
from web import api as api_routes

logger = logger_config(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    logger.info("startup: triggered")

    yield

    logger.info("shutdown: triggered")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
)

origins = [
    "*",  # Permite solicitudes CORS desde este origen
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_routes)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", reload=True)
