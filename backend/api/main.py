# api/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
from contextlib import asynccontextmanager

from api.core.config import settings
from api.core.logging import setup_logging
from api.core.errors import add_error_handlers
from api.routes import api_router

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Flood Prediction System API...")
    yield
    logger.info("Shutting down Flood Prediction System API...")

# Create FastAPI app with lifespan handler
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add error handlers
add_error_handlers(app)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"Request: {request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Time: {process_time:.4f}s"
    )
    return response

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["status"])
async def root():
    """
    Root endpoint that confirms the API is running.
    """
    return {
        "message": "Flood Prediction System API is running",
        "status": "healthy",
        "version": "1.0.0",
        "documentation": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health", tags=["status"])
async def health_check():
    """
    Health check endpoint for monitoring systems.
    """
    return {
        "status": "healthy",
        "timestamp": time.time()
    }
