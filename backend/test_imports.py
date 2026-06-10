"""Test that all modules can be imported correctly"""
import sys
from pathlib import Path

# Adicionar backend ao path
sys.path.insert(0, str(Path(__file__).parent))

def test_main_imports():
    """Test that main.py can be imported"""
    try:
        import main
        assert hasattr(main, 'app'), "main.py must define 'app'"
        print("✅ main.py imported successfully")
    except Exception as e:
        print(f"❌ Failed to import main.py: {e}")
        raise

def test_models_imports():
    """Test that models can be imported"""
    try:
        from models.rsvp import RSVPSubmission
        assert RSVPSubmission is not None
        print("✅ models.rsvp imported successfully")
    except Exception as e:
        print(f"❌ Failed to import models: {e}")
        raise

def test_services_imports():
    """Test that services can be imported"""
    try:
        from services.telegram import dispatch_telegram_alert, send_telegram_alert_sync
        from services.supabase import get_client
        assert dispatch_telegram_alert is not None
        assert get_client is not None
        print("✅ services imported successfully")
    except Exception as e:
        print(f"❌ Failed to import services: {e}")
        raise

def test_routers_imports():
    """Test that routers can be imported"""
    try:
        from routers.rsvp import router
        assert router is not None
        print("✅ routers.rsvp imported successfully")
    except Exception as e:
        print(f"❌ Failed to import routers: {e}")
        raise

if __name__ == "__main__":
    test_main_imports()
    test_models_imports()
    test_services_imports()
    test_routers_imports()
    print("\n✨ All import tests passed!")
