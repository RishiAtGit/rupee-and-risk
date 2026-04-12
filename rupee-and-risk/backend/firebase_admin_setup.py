"""
Firebase Admin SDK initializer.
Reads FIREBASE_SERVICE_ACCOUNT_JSON from environment (a JSON string).
Initialized once at module import — imported by auth.py.
"""
import os
import json
import firebase_admin
from firebase_admin import credentials

_app = None

def get_firebase_app():
    global _app
    if _app is not None:
        return _app

    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if service_account_json:
        try:
            cred_dict = json.loads(service_account_json)
            cred = credentials.Certificate(cred_dict)
            _app = firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK initialized successfully.")
        except Exception as e:
            print(f"❌ Firebase Admin SDK initialization failed: {e}")
    else:
        print("⚠️ FIREBASE_SERVICE_ACCOUNT_JSON not set — Firebase auth will not work.")
    
    return _app
