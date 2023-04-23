from datetime import datetime
from typing import List, Tuple
from pydantic import BaseModel
from enum import Enum


class TranscriptSection(BaseModel):
    start: datetime
    end: datetime
    content: str


class Transcription(BaseModel):
    name: str
    sections: List[TranscriptSection]


class Severity(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    FIRE = "fire"


class Alert(BaseModel):
    label: str
    severity: Severity
    date: datetime
    transcript: List[TranscriptSection]

    raw_address: str
    address: str
    name: str
    coord: Tuple[float, float]  # latitude, longitude
