"""End-to-end API & unit tests for RSVP creation, validation, duplicate email,
individual guest removal (guest token & admin), and confirmation email.
Runs completely offline with an in-memory fake Supabase client."""
import asyncio
import sys
import uuid
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

sys.path.insert(0, str(Path(__file__).parent))

from fastapi.testclient import TestClient

import main
import routers.rsvp as rsvp_router
import routers.admin as admin_router
import services.auth as auth_service
import services.email as email_service


class FakeQuery:
    def __init__(self, db: dict, table: str):
        self.db = db
        self.table = table
        self._op = "select"
        self._select_cols = "*"
        self._filters: list[tuple[str, str, object]] = []
        self._payload = None
        self._limit = None
        self._order_col = None
        self._order_desc = False

    def select(self, cols="*"):
        self._op = "select"
        self._select_cols = cols
        return self

    def insert(self, payload):
        self._op = "insert"
        self._payload = payload
        return self

    def update(self, payload):
        self._op = "update"
        self._payload = payload
        return self

    def delete(self):
        self._op = "delete"
        return self

    def eq(self, col, val):
        self._filters.append(("eq", col, val))
        return self

    def ilike(self, col, val):
        self._filters.append(("ilike", col, val))
        return self

    def order(self, col, desc=False):
        self._order_col = col
        self._order_desc = desc
        return self

    def limit(self, n):
        self._limit = n
        return self

    def _matches(self, row: dict) -> bool:
        for op, col, val in self._filters:
            cur = row.get(col)
            if op == "eq" and str(cur) != str(val):
                return False
            if op == "ilike" and str(cur or "").lower() != str(val).lower():
                return False
        return True

    def execute(self):
        rows = self.db[self.table]
        if self._op == "insert":
            items = self._payload if isinstance(self._payload, list) else [self._payload]
            inserted = []
            for item in items:
                rec = dict(item)
                rec.setdefault("id", str(uuid.uuid4()))
                rec.setdefault("created_at", "2026-11-20T18:00:00Z")
                if self.table == "rsvps":
                    rec.setdefault("manage_token", str(uuid.uuid4()))
                    # Enforce unique email constraint (case-insensitive)
                    email_lower = rec["email"].strip().lower()
                    if any(r["email"].strip().lower() == email_lower for r in rows):
                        raise Exception("duplicate key value violates unique constraint uq_rsvps_email_lower (23505)")
                rows.append(rec)
                inserted.append(dict(rec))
            return SimpleNamespace(data=inserted)

        if self._op == "select":
            matched = [dict(r) for r in rows if self._matches(r)]
            if self.table == "rsvps" and "rsvp_guests" in self._select_cols:
                for r in matched:
                    r["rsvp_guests"] = [
                        dict(g) for g in self.db["rsvp_guests"] if str(g["rsvp_id"]) == str(r["id"])
                    ]
            if self._order_col:
                matched.sort(key=lambda r: r.get(self._order_col) or "", reverse=self._order_desc)
            if self._limit is not None:
                matched = matched[: self._limit]
            return SimpleNamespace(data=matched)

        if self._op == "update":
            updated = []
            for r in rows:
                if self._matches(r):
                    r.update(self._payload)
                    updated.append(dict(r))
            return SimpleNamespace(data=updated)

        if self._op == "delete":
            kept = []
            deleted = []
            for r in rows:
                if self._matches(r):
                    deleted.append(dict(r))
                else:
                    kept.append(r)
            self.db[self.table] = kept
            return SimpleNamespace(data=deleted)

        return SimpleNamespace(data=[])


class FakeSupabase:
    def __init__(self):
        self.db = {"rsvps": [], "rsvp_guests": []}

    def table(self, name: str) -> FakeQuery:
        return FakeQuery(self.db, name)


def test_full_rsvp_lifecycle():
    fake_db = FakeSupabase()
    email_mock = AsyncMock(return_value=True)
    telegram_mock = AsyncMock(return_value=None)

    client = TestClient(main.app)

    with (
        patch.object(rsvp_router, "get_service_client", return_value=fake_db),
        patch.object(rsvp_router, "send_confirmation_email", email_mock),
        patch.object(rsvp_router, "dispatch_telegram_alert", telegram_mock),
        patch.object(admin_router, "get_client_for_token", return_value=fake_db),
        patch.object(
            auth_service,
            "get_client",
            return_value=SimpleNamespace(
                auth=SimpleNamespace(
                    get_user=lambda t: SimpleNamespace(user=SimpleNamespace(id="admin-uuid"))
                )
            ),
        ),
        patch.dict("os.environ", {"ADMIN_USER_ID": "admin-uuid"}),
    ):
        # 1. Missing required fields (phone & guest_names) -> 422
        resp = client.post(
            "/api/rsvp",
            json={
                "name": "Ana Silva",
                "email": "ana@example.com",
                "attending": "yes",
                "guests": 2,
            },
        )
        assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"
        print("✅ missing required fields rejected with 422")

        # 2. Invalid phone -> 422
        resp = client.post(
            "/api/rsvp",
            json={
                "name": "Ana Silva",
                "email": "ana@example.com",
                "phone": "123",
                "attending": "yes",
                "guests": 1,
                "guest_names": ["Ana Silva"],
            },
        )
        assert resp.status_code == 422
        print("✅ invalid phone rejected with 422")

        # 3. Mismatched guest names count -> 422
        resp = client.post(
            "/api/rsvp",
            json={
                "name": "Ana Silva",
                "email": "ana@example.com",
                "phone": "(12) 99999-8888",
                "attending": "yes",
                "guests": 2,
                "guest_names": ["Ana Silva"],
            },
        )
        assert resp.status_code == 422
        print("✅ mismatched guest_names length rejected with 422")

        # 3b. More than 4 adult guests -> 422
        resp = client.post(
            "/api/rsvp",
            json={
                "name": "Ana Silva",
                "email": "ana@example.com",
                "phone": "(12) 99999-8888",
                "attending": "yes",
                "guests": 5,
                "guest_names": ["A", "B", "C", "D", "E"],
            },
        )
        assert resp.status_code == 422
        print("✅ more than 4 adult guests rejected with 422")

        # 3c. More than 4 children -> 422
        resp = client.post(
            "/api/rsvp",
            json={
                "name": "Ana Silva",
                "email": "ana@example.com",
                "phone": "(12) 99999-8888",
                "attending": "yes",
                "guests": 1,
                "guest_names": ["Ana Silva"],
                "children_count": 5,
                "children_names": ["C1", "C2", "C3", "C4", "C5"],
            },
        )
        assert resp.status_code == 422
        print("✅ more than 4 children rejected with 422")

        # 4. Valid RSVP with 2 adults (>7 years) + 2 children (<=7 years, independent count)
        resp = client.post(
            "/api/rsvp",
            json={
                "name": "Ana Silva",
                "email": "Ana@Example.com",
                "phone": "(12) 99999-8888",
                "attending": "yes",
                "guests": 2,
                "guest_names": ["Ana Silva", "Carlos Silva"],
                "children_count": 2,
                "children_names": ["Pedro Silva", "Sofia Silva"],
                "note": "Felicidades ao casal!",
            },
        )
        assert resp.status_code == 201, resp.text
        data = resp.json()
        assert data["status"] == "ok"
        assert data["email_sent"] is True
        assert len(data["guests_list"]) == 4
        adults = [g for g in data["guests_list"] if g["guest_type"] == "adult"]
        children = [g for g in data["guests_list"] if g["guest_type"] == "child"]
        assert len(adults) == 2
        assert len(children) == 2
        manage_token = data["manage_token"]
        rsvp_id = data["id"]
        email_mock.assert_awaited_once()
        print("✅ valid RSVP with individual guests & children saved and confirmation email triggered")

        # 5. Duplicate email (different casing) -> 409
        dup = client.post(
            "/api/rsvp",
            json={
                "name": "Outra Ana",
                "email": "ANA@example.com",
                "phone": "(12) 98888-7777",
                "attending": "yes",
                "guests": 1,
                "guest_names": ["Outra Ana"],
            },
        )
        assert dup.status_code == 409, dup.text
        assert "já possui uma confirmação" in dup.json()["detail"]
        print("✅ duplicate email rejected with 409")

        # 6. Fetch RSVP via secure manage_token
        get_res = client.get(f"/api/rsvp/manage/{manage_token}")
        assert get_res.status_code == 200
        managed = get_res.json()
        assert managed["guests"] == 2
        assert managed["children_count"] == 2
        assert len(managed["guests_list"]) == 4
        print("✅ manage endpoint returns RSVP with all individual guests & children")

        # 7. Remove one individual adult guest via guest token (without deleting the RSVP)
        carlos = next(g for g in managed["guests_list"] if g["full_name"] == "Carlos Silva")
        del_res = client.delete(f"/api/rsvp/manage/{manage_token}/guests/{carlos['id']}")
        assert del_res.status_code == 200, del_res.text
        del_data = del_res.json()
        assert del_data["removed_guest_name"] == "Carlos Silva"
        assert del_data["rsvp"]["guests"] == 1
        assert del_data["rsvp"]["children_count"] == 2
        assert del_data["rsvp"]["attending"] == "yes"
        assert len(del_data["rsvp"]["guests_list"]) == 3
        print("✅ removing an individual adult guest updates count without affecting others")

        # 8. Remove one individual child via admin endpoint
        sofia = next(g for g in del_data["rsvp"]["guests_list"] if g["full_name"] == "Sofia Silva")
        adm_del = client.delete(
            f"/api/admin/rsvps/{rsvp_id}/guests/{sofia['id']}",
            headers={"Authorization": "Bearer admin-token"},
        )
        assert adm_del.status_code == 200, adm_del.text
        assert adm_del.json()["rsvp"]["guests"] == 1
        assert adm_del.json()["rsvp"]["children_count"] == 1
        assert len(adm_del.json()["rsvp"]["rsvp_guests"]) == 2
        print("✅ admin can remove an individual child without affecting adults")

        # 9. Admin list shows updated RSVP with remaining guests
        list_res = client.get(
            "/api/admin/rsvps",
            headers={"Authorization": "Bearer admin-token"},
        )
        assert list_res.status_code == 200
        assert len(list_res.json()) == 1
        assert list_res.json()[0]["guests"] == 1
        assert list_res.json()[0]["children_count"] == 1
        print("✅ admin listing returns relational rsvp_guests accurately")

        # 10. Attending = 'no' registration works cleanly with guests=0
        no_res = client.post(
            "/api/rsvp",
            json={
                "name": "Bruno Costa",
                "email": "bruno@example.com",
                "phone": "(11) 97777-6666",
                "attending": "no",
                "guests": 0,
            },
        )
        assert no_res.status_code == 201, no_res.text
        assert no_res.json()["guests_list"] == []
        print("✅ attending='no' RSVP succeeds with 0 guests")


def test_email_builder_and_graceful_unconfigured():
    subject, html_body, text_body = email_service.build_confirmation_email(
        name="Ana <script>",
        attending="yes",
        phone="(12) 99999-8888",
        guest_names=["Ana", "Carlos"],
        children_names=["Pedro"],
        manage_url="https://melissalevi.page/rsvp?token=abc-123",
    )
    assert "Melissa & Levi" in subject
    assert "&lt;script&gt;" in html_body
    assert "Bassi Eventos" in html_body
    assert "estacionamento no local" in html_body
    assert "https://melissalevi.page/rsvp?token=abc-123" in html_body
    assert "Carlos" in text_body
    assert "Pedro" in text_body

    with patch.dict("os.environ", {"RESEND_API_KEY": "", "SMTP_HOST": "", "SMTP_USER": "", "SMTP_PASSWORD": ""}, clear=False):
        sent = asyncio.run(
            email_service.send_confirmation_email(
                name="Ana",
                email="ana@example.com",
                phone="(12) 99999-8888",
                attending="yes",
                guest_names=["Ana"],
                children_names=[],
                manage_token="abc-123",
            )
        )
        assert sent is False
    print("✅ email template escapes HTML, includes venue/manage link, and degrades gracefully when unconfigured")


if __name__ == "__main__":
    test_full_rsvp_lifecycle()
    test_email_builder_and_graceful_unconfigured()
    print("\n✨ All RSVP & email tests passed!")
