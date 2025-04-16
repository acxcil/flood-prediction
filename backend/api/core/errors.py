from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

class PredictionError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class ValidationError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class DataError(Exception):
    def __init__(self, message: str, status_code: int = 404):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

def add_error_handlers(app: FastAPI):
    @app.exception_handler(PredictionError)
    async def prediction_error_handler(request: Request, exc: PredictionError):
        logger.error(f"Prediction error: {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message}
        )
    
    @app.exception_handler(ValidationError)
    async def validation_error_handler(request: Request, exc: ValidationError):
        logger.warning(f"Validation error: {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message}
        )
    
    @app.exception_handler(DataError)
    async def data_error_handler(request: Request, exc: DataError):
        logger.warning(f"Data error: {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message}
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "An unexpected error occurred"}
        )