import os
import asyncio
from telegram import Bot
from telegram.error import TelegramError

async def dispatch_telegram_alert(message: str, parse_mode: str = "HTML"):
    """Send message to Telegram chat (async)"""
    try:
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        chat_id = os.getenv("TELEGRAM_CHAT_ID")
        if not bot_token or not chat_id:
            print("⚠️  Telegram não configurado (token ou chat_id ausente)")
            return
        bot = Bot(token=bot_token)
        await bot.send_message(
            chat_id=chat_id,
            text=message,
            parse_mode=parse_mode
        )
        print("✅ Mensagem enviada para Telegram")
    except TelegramError as e:
        print(f"❌ Erro Telegram: {e}")
    except Exception as e:
        print(f"❌ Erro ao enviar Telegram: {e}")

def send_telegram_alert_sync(message: str, parse_mode: str = "HTML"):
    """Send message to Telegram chat (sync wrapper)"""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    loop.create_task(dispatch_telegram_alert(message, parse_mode))

async def send_telegram_formatting_example():
    """Example of formatted messages"""
    examples = {
        "bold": "<b>Texto em negrito</b>",
        "italic": "<i>Texto em itálico</i>",
        "code": "<code>código_aqui</code>",
        "pre": "<pre>código de bloco</pre>",
        "link": '<a href="https://google.com">Google</a>',
    }
    return examples
