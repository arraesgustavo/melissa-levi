from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class RSVPSubmission(BaseModel):
    name: str
    email: EmailStr
    attending: Literal["yes", "no"]
    guests: Optional[int] = 1
    meal: Optional[str] = None
    dietary: Optional[str] = None
    song: Optional[str] = None
    note: Optional[str] = None
