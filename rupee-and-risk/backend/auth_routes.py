from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from pydantic import BaseModel
from models import engine, User
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from google.oauth2 import id_token
from google.auth.transport import requests
import os

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Replace with your actual Google Client ID if available, or keep as a dummy for now
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "dummy_google_client_id")

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str # The JWT from Google

@router.post("/register")
def register_user(req: RegisterRequest):
    with Session(engine) as session:
        existing_user = session.exec(select(User).where(User.email == req.email)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        new_user = User(
            email=req.email,
            hashed_password=get_password_hash(req.password),
            full_name=req.full_name
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        
        token = create_access_token(data={"sub": new_user.email})
        return {"access_token": token, "token_type": "bearer", "user": {"email": new_user.email, "is_pro_member": new_user.is_pro_member}}

@router.post("/login")
def login_user(req: LoginRequest):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == req.email)).first()
        if not user or not user.hashed_password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        if not verify_password(req.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        token = create_access_token(data={"sub": user.email})
        return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "is_pro_member": user.is_pro_member}}

@router.post("/google")
def google_auth(req: GoogleLoginRequest):
    try:
        # Verify the Google JWT token
        # In a real production app, ensure GOOGLE_CLIENT_ID matches your React app's client ID
        idinfo = id_token.verify_oauth2_token(req.credential, requests.Request())
        
        email = idinfo['email']
        name = idinfo.get('name', '')
        google_id = idinfo['sub']
        
        with Session(engine) as session:
            user = session.exec(select(User).where(User.email == email)).first()
            if not user:
                # Auto-register the user if they don't exist
                user = User(
                    email=email,
                    google_id=google_id,
                    full_name=name
                )
                session.add(user)
                session.commit()
                session.refresh(user)
            elif not user.google_id:
                # Link google account if email exists but google_id doesn't
                user.google_id = google_id
                session.add(user)
                session.commit()
                session.refresh(user)
                
            token = create_access_token(data={"sub": user.email})
            return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "is_pro_member": user.is_pro_member}}
            
    except ValueError as e:
        # Invalid token
        raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_pro_member": current_user.is_pro_member
    }
