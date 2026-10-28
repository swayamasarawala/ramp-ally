import os
from dataclasses import dataclass, field

from dotenv import find_dotenv, load_dotenv

# Load the repo-root .env (searched upward from this file). Real environment
# variables take precedence over values in the file.
load_dotenv(find_dotenv())

DEFAULT_CORS_ORIGINS = "http://localhost:3000"


def _split(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    """Settings from the environment. Variable names follow .env.example."""

    cors_origins: list[str] = field(
        default_factory=lambda: _split(DEFAULT_CORS_ORIGINS)
    )

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            cors_origins=_split(os.getenv("CORS_ORIGINS") or DEFAULT_CORS_ORIGINS)
        )
