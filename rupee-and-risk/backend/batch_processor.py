import time
from sqlmodel import Session, select
from models import engine, create_db_and_tables, EarningsCall, FinancialMetric, GrowthTrigger, GuidanceItem, RiskItem
from screener import get_latest_transcript_pdf, get_recent_concall_tickers 
from utils import extract_text_from_pdf
from ai_agent import analyze_earnings_call

# The "Bulletproof" Fallback List
FALLBACK_WATCHLIST = ["TCS", "INFY", "RELIANCE", "HDFCBANK", "ITC", "WIPRO"]

def run_daily_fetcher():
    print("🚀 Starting Automated Earnings Fetcher...")
    
    # FIX: Tell the robot to create the database tables if they don't exist!
    create_db_and_tables()
    
    # 1. Try to get the dynamic live feed
    live_watchlist = get_recent_concall_tickers()
    
    if not live_watchlist:
        print("🤷‍♂️ Screener blocked the live feed (requires login). Using standard Watchlist...")
        live_watchlist = FALLBACK_WATCHLIST
        
    print(f"🎯 Processing these companies: {live_watchlist}")
    
    with Session(engine) as session:
        for ticker in live_watchlist:
            print(f"\n--- Processing {ticker} ---")
            
            # Note: We now check uniqueness AFTER AI extraction because we need the precise Quarter
            # So we move the AI extraction UP, before the DB check!
                
            # 3. Scrape the PDF
            pdf_bytes, error = get_latest_transcript_pdf(ticker)
            if error or not pdf_bytes:
                print(f"⚠️ Could not find transcript for {ticker}: {error}")
                continue
                
            # 4. Read and Analyze
            print(f"🧠 Sending {ticker} to Gemini...")
            raw_text = extract_text_from_pdf(pdf_bytes)
            
            try:
                ai_data = analyze_earnings_call(raw_text)
                if not ai_data: 
                    continue
                    
                target_quarter = ai_data.get("quarter_identifier", "Latest")
                
                # Check Database Uniqueness (Ticker + Quarter)
                existing = session.exec(
                    select(EarningsCall).where(
                        EarningsCall.ticker == ticker, 
                        EarningsCall.quarter == target_quarter
                    )
                ).first()
                
                if existing:
                    print(f"✅ We already have data for {ticker} ({target_quarter}). Skipping DB insert.")
                    continue
                
                # 5. Save the NEW massive data structure to Database
                call = EarningsCall(
                    company_name=ticker, 
                    ticker=ticker, 
                    quarter=target_quarter, 
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
                
                for item in ai_data.get("financials", []): session.add(FinancialMetric(metric_name=item["metric"], value=item["value"], commentary=item["commentary"], call_id=call.id))
                for item in ai_data.get("triggers", []): session.add(GrowthTrigger(category=item["category"], description=item["description"], call_id=call.id))
                for item in ai_data.get("guidance", []): session.add(GuidanceItem(metric=item["metric"], outlook=item["outlook"], commentary=item["commentary"], call_id=call.id))
                for item in ai_data.get("risks", []): session.add(RiskItem(risk=item["risk"], context=item["context"], call_id=call.id))
                
                session.commit()
                print(f"💾 Successfully saved {ticker} with ALL new data sections!")
                
            except Exception as e:
                print(f"❌ Failed to process {ticker}: {e}")

            # 6. Sleep for 15 seconds to prevent rate limits
            print("⏳ Sleeping for 15 seconds to prevent rate limits...")
            time.sleep(15)
            
    print("\n🎉 All caught up! The database is up to date.")

if __name__ == "__main__":
    run_daily_fetcher()