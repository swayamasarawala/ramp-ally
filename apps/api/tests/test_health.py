from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app

FRONTEND_ORIGIN = "http://localhost:3000"


def make_client(settings: Settings | None = None) -> TestClient:
    return TestClient(create_app(settings or Settings()))


def test_health_returns_ok() -> None:
    response = make_client().get("/health")

    assert response.status_code == 200
    assert response.json() == {"ok": True}


def test_health_allows_configured_frontend_origin() -> None:
    response = make_client().get("/health", headers={"Origin": FRONTEND_ORIGIN})

    assert response.headers["access-control-allow-origin"] == FRONTEND_ORIGIN


def test_health_rejects_unconfigured_origin() -> None:
    response = make_client().get("/health", headers={"Origin": "https://evil.example"})

    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers


def test_cors_origins_parsed_from_comma_separated_env(monkeypatch) -> None:
    monkeypatch.setenv("CORS_ORIGINS", "http://a.test, http://b.test")

    assert Settings.from_env().cors_origins == ["http://a.test", "http://b.test"]


def test_cors_origins_default_when_unset(monkeypatch) -> None:
    monkeypatch.delenv("CORS_ORIGINS", raising=False)

    assert Settings.from_env().cors_origins == [FRONTEND_ORIGIN]
