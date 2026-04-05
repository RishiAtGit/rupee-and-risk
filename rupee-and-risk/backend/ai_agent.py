import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()  # Load from .env file

def analyze_earnings_call(text_content: str):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("❌ ERROR: API Key is missing! Check your .env file.")
        raise ValueError("API Key not found.")
    
    client = genai.Client(api_key=api_key)

    prompt = f"""
    You are a financial analyst. Analyze this earnings call transcript.
    
    Task:
    1. Quarter Identifier: Extract the exact quarter and year (e.g., "Q3 FY26", "Q2 2024"). Fallback to "Latest" if completely missing.
    2. Summary: Professional 2-sentence summary.
    3. Participants: List Executives and Analysts.
    4. Financials: Extract Key KPIs.
    4. Triggers: Future growth drivers.
    5. Geographic & Segment Commentary: Extract key bullet points (separate with newlines).
    6. Company-Specific & Strategic: Extract key bullet points (separate with newlines).
    7. Guidance & Outlook: Extract metrics, outlook, and commentary.
    8. Risks & Constraints: Extract risks and context.
    9. Q&A Highlights: Extract 2-3 important Q&A pairs (separate with newlines).
    10. Key Takeaway: 1 solid paragraph conclusion.

    Transcript:
    {text_content[:30000]} 

    Output JSON Schema:
    {{
        "quarter_identifier": "[STRICTLY EXTRACT QUARTER AND FORMAT EXCLUSIVELY AS 'Q# FY##'. E.g. convert '3QFY2026' or 'Quarter 3 2026' into exactly 'Q3 FY26']",
        "summary": "...",
        "participants": "...",
        "financials": [ {{ "metric": "", "value": "", "commentary": "" }} ],
        "triggers": [ {{ "category": "", "description": "" }} ],
        "geographic_commentary": "Point 1\\nPoint 2",
        "strategic_commentary": "Point 1\\nPoint 2",
        "guidance": [ {{ "metric": "", "outlook": "", "commentary": "" }} ],
        "risks": [ {{ "risk": "", "context": "" }} ],
        "qa_highlights": "Q: ...\\nA: ...\\n\\nQ: ...\\nA: ...",
        "key_takeaway": "Final paragraph..."
    }}
    """

    print("🧠 Analyzing ALL 10 sections with Gemini Flash Latest...")
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-flash-latest', 
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json'
                )
            )
            
            # --- THE FIX: Clean the response text before parsing ---
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:-3].strip()
                
            return json.loads(raw_text)

        except Exception as e:
            if "429" in str(e):
                print(f"⏳ Quota hit (Attempt {attempt+1}/{max_retries}). Waiting 60 seconds...")
                time.sleep(60)
                continue
            else:
                # --- THE FIX: Print the exact error so we aren't blind ---
                print(f"❌ GEMINI PARSE ERROR on Attempt {attempt+1}: {str(e)}")
                time.sleep(5)
                continue # Try again instead of giving up immediately
    
    print("❌ Completely failed to process document after 3 retries.")
    return {}