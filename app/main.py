from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging import setup_logging

setup_logging(settings.log_level)

app = FastAPI(title="NosteSphere", debug=settings.debug)

app.include_router(api_router, prefix="/api/v1")
