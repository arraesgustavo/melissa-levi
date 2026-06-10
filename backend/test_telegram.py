import asyncio
import os
from dotenv import load_dotenv
from services.telegram import dispatch_telegram_alert

load_dotenv()

async def test():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    print(f"Token carregado: {bool(token)}")
    print(f"Chat ID carregado: {bool(chat_id)}")

    await dispatch_telegram_alert(
        '🧪 <b>Teste de conexão!</b>\nSeu bot Telegram está funcionando.',
        parse_mode='HTML'
    )

asyncio.run(test())
