import sqlite3
import datetime
import os

db_path = r'c:\rupee\rupee-and-risk\backend\rupee_risk.db'

print("Migrating DB at", db_path)
conn = sqlite3.connect(db_path)
c = conn.cursor()

try:
    c.execute("ALTER TABLE earningscall ADD COLUMN created_at DATETIME")
    # We stagger the dates backwards so ID 1 gets the oldest date, 
    # and highest ID gets the newest date (close to today).
    # Total IDs usually aren't huge, so we just subtract (max_id - id) from today.
    # We assume 'id' is mostly sequential.
    
    # First find max id
    c.execute("SELECT MAX(id) FROM earningscall")
    max_id = c.fetchone()[0] or 1
    
    # Update script
    c.execute(f"UPDATE earningscall SET created_at = datetime('now', '-' || ({max_id} - id) || ' days')")
    conn.commit()
    print("Migration successful! Added created_at.")
except Exception as e:
    print("Migration error (may already be migrated):", e)
    
conn.close()
