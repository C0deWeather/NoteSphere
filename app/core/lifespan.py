import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI


logger = logging.getLogger("app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.repositories.user_repo import InappTempMemory

    logger.info("App is starting...")
    app.state.user_repo = InappTempMemory()
    logger.info("User repo is ready")

    yield

    logger.info("App is shutting down...")
