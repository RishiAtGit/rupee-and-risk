import os
from google import genai

# 1. Get the Key
api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    print("❌ Key missing. Run $env:GOOGLE_API_KEY='...' first")
    exit()

print(f"🔑 Checking models for key: {api_key[:10]}...")
client = genai.Client(api_key=api_key)

# 2. List Models
try:
    print("--- Available Models ---")
    for m in client.models.list():
        # Check if the model supports generating content
        if "generateContent" in m.supported_actions:
            print(f"✅ {m.name}")
    print("------------------------")
except Exception as e:
    print(f"❌ Error: {e}")