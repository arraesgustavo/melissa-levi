import asyncio
import html
import os
import smtplib
from email.message import EmailMessage
import httpx


EVENT_DATE = "Domingo, 11 de Julho de 2027"
EVENT_TIME = "Cerimônia · 15h"
EVENT_VENUE = "Bassi Eventos"
EVENT_ADDRESS = "Rua Osberre Bassi, 367 - Jardim São Judas Tadeu, São José dos Campos - SP"


def build_confirmation_email(
    *,
    name: str,
    attending: str,
    phone: str,
    guest_names: list[str],
    children_names: list[str],
    manage_url: str,
) -> tuple[str, str, str]:
    """Return (subject, html_body, text_body) for the RSVP confirmation email."""
    safe_name = html.escape(name)
    safe_phone = html.escape(phone)
    safe_url = html.escape(manage_url, quote=True)

    if attending == "yes":
        subject = "Confirmação de Presença — Casamento Melissa & Levi"
        intro_html = (
            f"Olá, <strong>{safe_name}</strong>! Sua confirmação de presença foi registrada com sucesso. "
            "Ficamos imensamente felizes em celebrar esse dia tão especial com você!"
        )
        intro_text = (
            f"Olá, {name}! Sua confirmação de presença foi registrada com sucesso. "
            "Ficamos imensamente felizes em celebrar esse dia tão especial com você!"
        )

        guests_items_html = "".join(
            f"<li style='margin:4px 0;color:#1C1B19;'>{html.escape(g)}</li>" for g in guest_names
        )
        guests_block_html = (
            f"<p style='margin:16px 0 6px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8A6F52;'>"
            f"Convidados confirmados (acima de 7 anos): {len(guest_names)}</p>"
            f"<ul style='margin:0 0 12px;padding-left:20px;'>{guests_items_html}</ul>"
        )
        guests_block_text = (
            f"\nConvidados confirmados (acima de 7 anos) ({len(guest_names)}):\n"
            + "\n".join(f"  - {g}" for g in guest_names)
        )

        if children_names:
            children_items_html = "".join(
                f"<li style='margin:4px 0;color:#1C1B19;'>{html.escape(c)}</li>" for c in children_names
            )
            children_block_html = (
                f"<p style='margin:16px 0 6px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8A6F52;'>"
                f"Crianças (até 7 anos): {len(children_names)}</p>"
                f"<ul style='margin:0 0 12px;padding-left:20px;'>{children_items_html}</ul>"
            )
            children_block_text = (
                f"\nCrianças (até 7 anos) ({len(children_names)}):\n"
                + "\n".join(f"  - {c}" for c in children_names)
            )
        else:
            children_block_html = ""
            children_block_text = ""

        manage_block_html = (
            f"<div style='margin-top:28px;padding-top:20px;border-top:1px solid #CDC2AE;text-align:center;'>"
            f"<p style='margin:0 0 14px;color:#7A6F60;font-size:14px;'>"
            f"Precisa remover algum convidado da sua confirmação?</p>"
            f"<a href='{safe_url}' style='display:inline-block;padding:12px 28px;border:1px solid #1C1B19;"
            f"color:#1C1B19;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;'>"
            f"Gerenciar Confirmação</a></div>"
        )
        manage_block_text = (
            f"\nPrecisa remover algum convidado da sua confirmação?\n"
            f"Acesse: {manage_url}\n"
        )
    else:
        subject = "Recebemos sua resposta — Casamento Melissa & Levi"
        intro_html = (
            f"Olá, <strong>{safe_name}</strong>. Obrigado por nos avisar que não poderá comparecer. "
            "Sua ausência será sentida, mas levaremos seu carinho conosco nesse dia especial."
        )
        intro_text = (
            f"Olá, {name}. Obrigado por nos avisar que não poderá comparecer. "
            "Sua ausência será sentida, mas levaremos seu carinho conosco nesse dia especial."
        )
        guests_block_html = ""
        guests_block_text = ""
        children_block_html = ""
        children_block_text = ""
        manage_block_html = ""
        manage_block_text = ""

    html_body = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background-color:#F4EEE3;font-family:'Helvetica Neue',Arial,sans-serif;color:#1C1B19;">
  <div style="max-width:560px;margin:0 auto;background-color:#FAF6EE;border:1px solid #CDC2AE;padding:36px 32px;">
    <p style="margin:0 0 8px;text-align:center;font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#8A6F52;">
      — 11.07.2027 —
    </p>
    <h1 style="margin:0 0 24px;text-align:center;font-family:Georgia,serif;font-weight:400;font-size:34px;color:#1C1B19;">
      Melissa &amp; Levi
    </h1>
    <p style="margin:0 0 20px;line-height:1.7;color:#4E473D;font-size:15px;">
      {intro_html}
    </p>
    <div style="background-color:#ECE3D4;padding:18px 20px;margin:20px 0;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8A6F52;">Detalhes do Evento</p>
      <p style="margin:6px 0 2px;font-family:Georgia,serif;font-size:20px;color:#1C1B19;">{EVENT_DATE}</p>
      <p style="margin:0 0 10px;font-size:14px;color:#4E473D;">{EVENT_TIME}</p>
      <p style="margin:0 0 2px;font-weight:600;font-size:15px;color:#1C1B19;">{EVENT_VENUE}</p>
      <p style="margin:0 0 8px;font-size:14px;color:#4E473D;">{EVENT_ADDRESS}</p>
      <p style="margin:0;font-size:13px;color:#4E473D;">
        A cerimônia e a recepção serão realizadas no Bassi Eventos. Terá estacionamento no local.
      </p>
    </div>
    <p style="margin:12px 0 0;font-size:14px;color:#4E473D;"><strong>Telefone cadastrado:</strong> {safe_phone}</p>
    {guests_block_html}
    {children_block_html}
    {manage_block_html}
    <p style="margin:28px 0 0;text-align:center;font-size:12px;color:#7A6F60;">
      Com carinho, Melissa &amp; Levi
    </p>
  </div>
</body>
</html>"""

    text_body = (
        f"Melissa & Levi — 11.07.2027\n\n"
        f"{intro_text}\n\n"
        f"Detalhes do Evento:\n"
        f"- {EVENT_DATE}\n"
        f"- {EVENT_TIME}\n"
        f"- {EVENT_VENUE} — {EVENT_ADDRESS}\n"
        f"- A cerimônia e a recepção serão realizadas no Bassi Eventos. Terá estacionamento no local.\n\n"
        f"Telefone cadastrado: {phone}\n"
        f"{guests_block_text}"
        f"{children_block_text}"
        f"{manage_block_text}\n"
        f"Com carinho, Melissa & Levi"
    )

    return subject, html_body, text_body


async def _send_via_resend(to_email: str, subject: str, html_body: str, text_body: str) -> bool:
    api_key = os.getenv("RESEND_API_KEY", "").strip()
    if not api_key:
        return False

    from_addr = os.getenv("EMAIL_FROM", "Melissa & Levi <onboarding@resend.dev>").strip()
    async with httpx.AsyncClient(timeout=8.0) as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_addr,
                "to": [to_email],
                "subject": subject,
                "html": html_body,
                "text": text_body,
            },
        )
        if 200 <= response.status_code < 300:
            print(f"✅ E-mail de confirmação enviado via Resend para {to_email}")
            return True
        print(f"❌ Erro Resend ({response.status_code}): {response.text}")
        return False


def _send_via_smtp_sync(to_email: str, subject: str, html_body: str, text_body: str) -> bool:
    host = os.getenv("SMTP_HOST", "").strip()
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    if not (host and user and password):
        return False

    port = int(os.getenv("SMTP_PORT", "587"))
    use_tls = os.getenv("SMTP_USE_TLS", "true").strip().lower() not in ("0", "false", "no")
    from_addr = os.getenv("EMAIL_FROM", user).strip()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_email
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")

    with smtplib.SMTP(host, port, timeout=8) as server:
        if use_tls:
            server.starttls()
        server.login(user, password)
        server.send_message(msg)

    print(f"✅ E-mail de confirmação enviado via SMTP para {to_email}")
    return True


async def send_confirmation_email(
    *,
    name: str,
    email: str,
    phone: str,
    attending: str,
    guest_names: list[str],
    children_names: list[str],
    manage_token: str,
) -> bool:
    """Send confirmation email via Resend API (preferred) or SMTP fallback.

    Never raises so email delivery issues do not fail RSVP persistence.
    """
    frontend_url = os.getenv("FRONTEND_URL", "https://melissalevi.page").rstrip("/")
    manage_url = f"{frontend_url}/rsvp?token={manage_token}"

    subject, html_body, text_body = build_confirmation_email(
        name=name,
        attending=attending,
        phone=phone,
        guest_names=guest_names,
        children_names=children_names,
        manage_url=manage_url,
    )

    try:
        if os.getenv("RESEND_API_KEY", "").strip():
            return await _send_via_resend(email, subject, html_body, text_body)

        if (
            os.getenv("SMTP_HOST", "").strip()
            and os.getenv("SMTP_USER", "").strip()
            and os.getenv("SMTP_PASSWORD", "").strip()
        ):
            return await asyncio.to_thread(
                _send_via_smtp_sync, email, subject, html_body, text_body
            )

        print("⚠️  E-mail não configurado (defina RESEND_API_KEY ou SMTP_HOST/SMTP_USER/SMTP_PASSWORD)")
        return False
    except Exception as exc:
        print(f"❌ Erro ao enviar e-mail de confirmação para {email}: {exc}")
        return False
