"""
Type definitions for YouTube parser service.
"""

from pydantic import BaseModel # type: ignore

class ScrapeRequest(BaseModel):
    """Request model for scraping a YouTube channel."""
    handle: str
    language: str = "en"
    quantity: int = 200

class QueryRequest(BaseModel):
    """Request model for searching and scraping YouTube videos."""
    query: str
    language: str = "en"
    quantity: int = 50

class VideoRequest(BaseModel):
    """Request model for scraping a specific YouTube video."""
    id: str
    language: str = "en" 