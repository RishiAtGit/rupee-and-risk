from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from models import create_db_and_tables, engine, EarningsCall, FinancialMetric, GrowthTrigger, GuidanceItem, RiskItem
from batch_processor import run_daily_fetcher
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
from auth_routes import router as auth_router
from payment_routes import router as payment_router
from models import User
from auth import get_pro_user

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI(title="RupeeAndRisk.ai API")
app.include_router(auth_router)
app.include_router(payment_router)

class ChatRequest(BaseModel):
    question: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8085", "http://127.0.0.1:8085"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    
    pass

from fastapi import Header

@app.post("/api/scheduler/force-fetch")
def force_fetch_webhook(webhook_token: str = Header(None)):
    expected_token = os.getenv("WEBHOOK_TOKEN")
    if not expected_token or webhook_token != expected_token:
        raise HTTPException(status_code=401, detail="Unauthorized Webhook")
    
    # Run the fetcher
    try:
        run_daily_fetcher()
        return {"status": "success", "message": "Batch processor executed successfully via webhook."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fetcher failed: {str(e)}")

@app.get("/api/companies")
def get_all_companies(user: User = Depends(get_pro_user)):
    with Session(engine) as session:
        calls = session.exec(select(EarningsCall).order_by(EarningsCall.id.desc())).all()
        result = []
        for c in calls:
            triggers = session.exec(select(GrowthTrigger).where(GrowthTrigger.call_id == c.id)).all()
            growth_text = "\n".join([t.description for t in triggers]) if triggers else ""
            result.append({
                "id": c.id,
                "ticker": c.ticker,
                "name": c.company_name,
                "quarter": c.quarter,
                "summary": c.summary or "",
                "growth_triggers": growth_text,
            })
        return result

@app.get("/api/companies/public")
def get_public_companies():
    """Public endpoint for marketing that hides proprietary insights."""
    with Session(engine) as session:
        calls = session.exec(select(EarningsCall).order_by(EarningsCall.id.asc()).limit(9)).all()
        result = []
        for c in calls:
            result.append({
                "id": c.id,
                "ticker": c.ticker,
                "name": c.company_name,
                "quarter": c.quarter,
                "summary": "Subscribe to Rupee And Risk PRO to unlock full institutional summaries and deep dive analysis.",
                "growth_triggers": "PRO ACCESS REQUIRED",
            })
        return result

@app.get("/api/company/public/{ticker}")
def get_public_company_details(ticker: str):
    """Teaser endpoint for marketing that limits the details."""
    with Session(engine) as session:
        c = session.exec(select(EarningsCall).where(EarningsCall.ticker == ticker)).first()
        if not c:
            raise HTTPException(status_code=404, detail="Company not found")
        
        strat_comm = (c.strategic_commentary[:200] + "...\n\n[Analysis redacted. Unlock Pro Terminal to read the full strategic evaluation, deep financial analysis, risks, and extraction of analyst Q&A nuances.]") if c.strategic_commentary else "Strategic commentary available for Pro members."
        
        return {
            "id": c.id,
            "ticker": c.ticker,
            "company_name": c.company_name,
            "quarter": c.quarter,
            "summary": c.summary or "",
            "key_takeaway": c.key_takeaway or "Premium insights available.",
            "participants": c.participants or "Management Team",
            "strategic_commentary": strat_comm,
            "geographic_commentary": "Comprehensive geographic breakdown analysis goes here for premium users...",
            "qa_highlights": "Analyst Q: Can you comment on the margin pacing?\nManagement A: You need Pro access to view our in-depth extraction of analyst Q&A nuances...",
            "financials": [
                {"metric_name": "Revenue", "value": "PRO ONLY", "commentary": "Detailed trajectory breakdown locked for Pro users."},
                {"metric_name": "EBITDA Margin", "value": "PRO ONLY", "commentary": "Detailed margin analysis locked for Pro users."},
                {"metric_name": "Net Income", "value": "PRO ONLY", "commentary": "Profitability roadmap locked for Pro users."}
            ],
            "guidance": [
                {"metric": "FY26 Core Growth", "outlook": "PRO ONLY", "commentary": "Subscribe to view outlook details."}
            ],
            "risks": [
                {"risk": "Geopolitical Volatility", "context": "Read the full analysis in Pro..."}
            ]
        }

@app.get("/api/company/{ticker}")
def get_company_details(ticker: str, user: User = Depends(get_pro_user)):
    with Session(engine) as session:
        call = session.exec(select(EarningsCall).where(EarningsCall.ticker == ticker)).first()
        if not call:
            raise HTTPException(status_code=404, detail="Company data not found")
            
        financials = session.exec(select(FinancialMetric).where(FinancialMetric.call_id == call.id)).all()
        triggers = session.exec(select(GrowthTrigger).where(GrowthTrigger.call_id == call.id)).all()
        guidance = session.exec(select(GuidanceItem).where(GuidanceItem.call_id == call.id)).all()
        risks = session.exec(select(RiskItem).where(RiskItem.call_id == call.id)).all()
        
        return {
            "company_name": call.company_name,
            "ticker": call.ticker,
            "quarter": call.quarter,
            "summary": call.summary,
            "participants": call.participants,
            "geographic_commentary": call.geographic_commentary,
            "strategic_commentary": call.strategic_commentary,
            "qa_highlights": call.qa_highlights,
            "key_takeaway": call.key_takeaway,
            "financials": financials,
            "triggers": triggers,
            "guidance": guidance,
            "risks": risks
        }

@app.post("/api/chat/{ticker}")
def chat_with_transcript(ticker: str, body: ChatRequest, user: User = Depends(get_pro_user)):
    """AI Analyst endpoint — ask any question about a company's earnings intelligence."""
    with Session(engine) as session:
        call = session.exec(select(EarningsCall).where(EarningsCall.ticker == ticker)).first()
        if not call:
            raise HTTPException(status_code=404, detail=f"No earnings data for {ticker}")
        
        triggers = session.exec(select(GrowthTrigger).where(GrowthTrigger.call_id == call.id)).all()
        risks = session.exec(select(RiskItem).where(RiskItem.call_id == call.id)).all()
        guidance = session.exec(select(GuidanceItem).where(GuidanceItem.call_id == call.id)).all()

        context = f"""
You are a sharp, institutional-grade equity analyst AI for Rupee And Risk — India's premier financial intelligence platform.
You are answering questions about {call.company_name} ({ticker}) for the {call.quarter} earnings period.

BUSINESS SUMMARY:
{call.summary or "Not available."}

GROWTH TRIGGERS:
{chr(10).join([t.description for t in triggers]) or "Not available."}

KEY RISKS:
{chr(10).join([f"{r.risk}: {r.context}" for r in risks]) or "Not available."}

MANAGEMENT GUIDANCE:
{chr(10).join([f"{g.metric}: {g.outlook} — {g.commentary}" for g in guidance]) or "Not available."}

STRATEGIC COMMENTARY:
{call.strategic_commentary or "Not available."}

Q&A HIGHLIGHTS:
{call.qa_highlights or "Not available."}

Answer the user's question clearly, concisely, and professionally. Reference specific data points when available. Be direct and insightful — avoid hedging language.
"""
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(f"{context}\n\nUSER QUESTION: {body.question}")
            return {"answer": response.text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI inference error: {str(e)}")