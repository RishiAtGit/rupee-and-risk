from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class EarningsCall(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_name: str
    ticker: str
    quarter: str
    summary: str
    participants: str
    # New text fields for the UI
    geographic_commentary: str = Field(default="")
    strategic_commentary: str = Field(default="")
    qa_highlights: str = Field(default="")
    key_takeaway: str = Field(default="")
    
    financials: List["FinancialMetric"] = Relationship(back_populates="call")
    triggers: List["GrowthTrigger"] = Relationship(back_populates="call")
    guidance: List["GuidanceItem"] = Relationship(back_populates="call")
    risks: List["RiskItem"] = Relationship(back_populates="call")

class FinancialMetric(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    metric_name: str
    value: str
    commentary: str
    call_id: Optional[int] = Field(default=None, foreign_key="earningscall.id")
    call: Optional[EarningsCall] = Relationship(back_populates="financials")

class GrowthTrigger(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category: str
    description: str
    call_id: Optional[int] = Field(default=None, foreign_key="earningscall.id")
    call: Optional[EarningsCall] = Relationship(back_populates="triggers")

# NEW TABLE: For the Guidance Table
class GuidanceItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    metric: str
    outlook: str
    commentary: str
    call_id: Optional[int] = Field(default=None, foreign_key="earningscall.id")
    call: Optional[EarningsCall] = Relationship(back_populates="guidance")

# NEW TABLE: For the Risks Table
class RiskItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    risk: str
    context: str
    call_id: Optional[int] = Field(default=None, foreign_key="earningscall.id")
    call: Optional[EarningsCall] = Relationship(back_populates="risks")

# NEW TABLE: For Pro Users & Auth
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: Optional[str] = Field(default=None)  # Legacy — kept for migration safety
    google_id: Optional[str] = Field(default=None)        # Legacy — superseded by Firebase
    firebase_uid: Optional[str] = Field(default=None, index=True)  # Firebase Auth UID
    full_name: str = Field(default="")
    is_pro_member: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

from sqlmodel import create_engine
import os

db_url = os.getenv("DATABASE_URL", "sqlite:///rupee_risk.db")
engine = create_engine(db_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)