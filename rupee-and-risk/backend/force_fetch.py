"""Force-fetches a set of new companies, bypassing the 'already exists' check."""
import time
import sys
import os
# Add the backend dir to path so imports work from any CWD
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlmodel import Session, select
from models import engine, create_db_and_tables, EarningsCall, FinancialMetric, GrowthTrigger, GuidanceItem, RiskItem
from screener import get_latest_transcript_pdf
from utils import extract_text_from_pdf
from ai_agent import analyze_earnings_call

# ✅ Fresh tickers to process - change this list as desired
FORCE_WATCHLIST = ["TCS", "INFY", "RELIANCE", "WIPRO", "ITC", "HDFCBANK", "BHARTIARTL"]

def run_force_fetch():
    print("🚀 Force-fetching new companies...")
    create_db_and_tables()

    with Session(engine) as session:
        for ticker in FORCE_WATCHLIST:
            print(f"\n--- Processing {ticker} ---")

            # Check if already exists
            existing = session.exec(select(EarningsCall).where(EarningsCall.ticker == ticker)).first()
            if existing:
                print(f"⏭️  {ticker} already in DB, skipping.")
                continue

            # Scrape PDF
            pdf_bytes, error = get_latest_transcript_pdf(ticker)
            if error or not pdf_bytes:
                print(f"⚠️  No transcript for {ticker}: {error}")
                continue

            print(f"🧠 Sending {ticker} to Gemini...")
            raw_text = extract_text_from_pdf(pdf_bytes)

            try:
                ai_data = analyze_earnings_call(raw_text)
                if not ai_data:
                    continue

                call = EarningsCall(
                    company_name=ticker,
                    ticker=ticker,
                    quarter="Q3 FY26",
                    summary=ai_data.get("summary", ""),
                    participants=ai_data.get("participants", ""),
                    geographic_commentary=ai_data.get("geographic_commentary", ""),
                    strategic_commentary=ai_data.get("strategic_commentary", ""),
                    qa_highlights=ai_data.get("qa_highlights", ""),
                    key_takeaway=ai_data.get("key_takeaway", "")
                )
                session.add(call)
                session.commit()
                session.refresh(call)

                for item in ai_data.get("financials", []):
                    session.add(FinancialMetric(metric_name=item["metric"], value=item["value"], commentary=item["commentary"], call_id=call.id))
                for item in ai_data.get("triggers", []):
                    session.add(GrowthTrigger(category=item["category"], description=item["description"], call_id=call.id))
                for item in ai_data.get("guidance", []):
                    session.add(GuidanceItem(metric=item["metric"], outlook=item["outlook"], commentary=item["commentary"], call_id=call.id))
                for item in ai_data.get("risks", []):
                    session.add(RiskItem(risk=item["risk"], context=item["context"], call_id=call.id))

                session.commit()
                print(f"💾 Saved {ticker} successfully!")

            except Exception as e:
                print(f"❌ Failed {ticker}: {e}")

            time.sleep(15)

    print("\n✅ Force-fetch complete!")

if __name__ == "__main__":
    run_force_fetch()
