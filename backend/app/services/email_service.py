# backend/app/services/email_service.py
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_verification_email(to_email: str, username: str, token: str) -> None:
    if not settings.smtp_user or not settings.smtp_password:
        logger.warning(
            "[email] SMTP nie skonfigurowany – pomijam wysyłkę. "
            "Ustaw SMTP_USER i SMTP_PASSWORD w docker-compose.yml"
        )
        return

    verification_url = f"{settings.frontend_url}/verify?token={token}"

    html_body = f"""
    <!DOCTYPE html>
    <html lang="pl">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#1a1410;font-family:Georgia,serif;">
      <table width="100%" cellpadding="0" cellspacing="0"
             style="max-width:520px;margin:40px auto;background:#2a1f14;
                    border:1px solid #5c3d1e;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:#8B0000;padding:24px;text-align:center;">
            <h1 style="margin:0;color:#f5e6c8;font-size:22px;letter-spacing:2px;
                       text-transform:uppercase;">
              ☩ Archiwum WFRP ☩
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#c9a96e;font-size:16px;margin:0 0 12px;">
              Witaj, <strong>{username}</strong>!
            </p>
            <p style="color:#9a8070;font-size:14px;line-height:1.7;margin:0 0 28px;">
              Twoje zgłoszenie do Archiwum Sigmarowego zostało zarejestrowane.
              Kliknij poniższy przycisk, aby aktywować konto i uzyskać dostęp
              do ksiąg i generatorów.
            </p>
            <div style="text-align:center;margin:0 0 28px;">
              <a href="{verification_url}"
                 style="display:inline-block;background:#8B0000;color:#f5e6c8;
                        padding:14px 32px;border-radius:6px;text-decoration:none;
                        font-size:15px;font-weight:bold;letter-spacing:1px;
                        border:1px solid #c0392b;">
                Aktywuj konto
              </a>
            </div>
            <p style="color:#6a5a4a;font-size:12px;line-height:1.6;margin:0 0 8px;">
              Jeśli przycisk nie działa, skopiuj ten link do przeglądarki:
            </p>
            <p style="color:#8B6914;font-size:11px;word-break:break-all;margin:0 0 28px;">
              {verification_url}
            </p>
            <hr style="border:none;border-top:1px solid #3a2a1a;margin:0 0 20px;">
            <p style="color:#4a3a2a;font-size:11px;margin:0;text-align:center;font-style:italic;">
              Link wygasa za 24 godziny.
              Jeśli nie zakładałeś konta — zignoruj tę wiadomość.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#1a1410;padding:16px;text-align:center;">
            <p style="color:#3a2a1a;font-size:10px;margin:0;font-style:italic;">
              "Wiedza jest ciężarem, ale ignorancja jest wyrokiem śmierci."
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Aktywacja konta — Archiwum WFRP"
    msg["From"] = f"Archiwum WFRP <{settings.mail_from}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.mail_from, to_email, msg.as_string())
        logger.info(f"[email] Wysłano e-mail aktywacyjny do: {to_email}")
    except smtplib.SMTPException as exc:
        logger.error(f"[email] Błąd SMTP przy wysyłaniu do {to_email}: {exc}")
        raise RuntimeError("Nie udało się wysłać e-maila aktywacyjnego") from exc
