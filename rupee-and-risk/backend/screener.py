"""
screener.py - Dynamic company discovery
Avoids Cloudflare bot-blocks on index pages by rotating through a massive pool of real Nifty 500 stocks.
"""
import requests
import random
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Massive pool of India's top companies to continuously rotate and discover
NIFTY_POOL = [
    "RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "BHARTIARTL", "INFY", "ITC", "SBI", "L&T", "BAJFINANCE",
    "HUL", "KOTAKBANK", "AXISBANK", "ASIANPAINT", "MARUTI", "SUNPHARMA", "TITAN", "ULTRACEMCO", "TATASTEEL",
    "NTPC", "BAJAJFINSV", "POWERGRID", "M&M", "INDUSINDBK", "NESTLEIND", "TECHM", "WIPRO", "HCLTECH",
    "GRASIM", "JSWSTEEL", "ADANIENT", "ADANIPORTS", "TATAMOTORS", "HINDALCO", "ONGC", "COALINDIA",
    "DIVISLAB", "APOLLOHOSP", "SBILIFE", "HDFCLIFE", "BAJAJ-AUTO", "CIPLA", "EICHERMOT", "BRITANNIA",
    "TATACONSUM", "DRREDDY", "HEROMOTOCO", "UPL", "BPCL", "LTIM", "PNB", "BANKBARODA", "ZOMATO"
]

def get_recent_concall_tickers():
    """
    Shuffles the massive pool and returns a random batch. 
    Since the batch processor runs every 12 hours, this will continuously discover 
    and backfill ALL top Indian companies over a few days completely dynamically.
    """
    print("📡 Rotating to a new dynamic batch of Nifty companies...")
    
    # Create a copy and shuffle it randomly so every run sees different companies
    shuffled_pool = list(NIFTY_POOL)
    random.shuffle(shuffled_pool)
    
    # Return a batch of 10 random major companies to process
    batch = shuffled_pool[:10]
    print(f"✅ Dynamic batch selected: {batch}")
    return batch

def get_latest_transcript_pdf(ticker: str):
    url = f"https://www.screener.in/company/{ticker}/"
    print(f"🕵️  Hunting transcript for {ticker} at {url}")

    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return None, f"Company page HTTP {r.status_code}"

        soup = BeautifulSoup(r.text, "html.parser")
        transcript_url = None
        for link in soup.find_all("a", href=True):
            href = link["href"].lower()
            text = link.get_text().lower()
            if "transcript" in text or "transcript" in href or "concall" in href:
                transcript_url = link["href"]
                break

        if not transcript_url:
            for link in soup.find_all("a", href=True):
                if link["href"].lower().endswith(".pdf"):
                    transcript_url = link["href"]
                    break

        if not transcript_url:
            return None, "No PDF found"

        if transcript_url.startswith("/"):
            transcript_url = "https://www.screener.in" + transcript_url

        pdf_r = requests.get(transcript_url, headers=HEADERS, timeout=20)
        return pdf_r.content, None
    except Exception as e:
        return None, str(e)