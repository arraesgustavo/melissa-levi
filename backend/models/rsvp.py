import re
from typing import Literal
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


def _clean_names(names: list[str]) -> list[str]:
    return [n.strip() for n in names if isinstance(n, str) and n.strip()]


class RSVPSubmission(BaseModel):
    name: str
    email: EmailStr
    phone: str
    attending: Literal["yes", "no"]
    guests: int = Field(ge=0, le=4)
    guest_names: list[str] = Field(default_factory=list)
    children_count: int = Field(default=0, ge=0, le=4)
    children_names: list[str] = Field(default_factory=list)
    note: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Informe o nome completo do responsável pela confirmação.")
        return cleaned

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = v.strip()
        digits = re.sub(r"\D", "", cleaned)
        if len(digits) < 10 or len(digits) > 15:
            raise ValueError("Informe um número de telefone válido com DDD.")
        return cleaned

    @field_validator("note")
    @classmethod
    def normalize_note(cls, v: str | None) -> str | None:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned or None

    @model_validator(mode="after")
    def validate_attendance_and_guests(self) -> "RSVPSubmission":
        if self.attending == "no":
            self.guests = 0
            self.guest_names = []
            self.children_count = 0
            self.children_names = []
            return self

        if self.guests < 1 or self.guests > 4:
            raise ValueError("Informe entre 1 e 4 convidados acima de 7 anos.")

        cleaned_guests = _clean_names(self.guest_names)
        if len(cleaned_guests) != self.guests:
            raise ValueError(
                f"Informe o nome individual de todos os {self.guests} convidado(s) acima de 7 anos."
            )
        self.guest_names = cleaned_guests

        cleaned_children = _clean_names(self.children_names)
        if self.children_count > 0:
            if len(cleaned_children) != self.children_count:
                raise ValueError(
                    f"Informe o nome de todas as {self.children_count} criança(s) cadastradas."
                )
            self.children_names = cleaned_children
        else:
            self.children_names = []

        return self


class GuestItem(BaseModel):
    id: str
    full_name: str
    guest_type: Literal["adult", "child"]
    is_primary: bool = False


class RSVPCreateResponse(BaseModel):
    status: Literal["ok"]
    id: str
    manage_token: str
    email_sent: bool
    guests_list: list[GuestItem]


class RSVPManageResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None = None
    attending: Literal["yes", "no"]
    guests: int
    children_count: int = 0
    note: str | None = None
    created_at: str | None = None
    guests_list: list[GuestItem]


class RemoveGuestResponse(BaseModel):
    status: Literal["ok"]
    removed_guest_name: str
    rsvp: RSVPManageResponse
