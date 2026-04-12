from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from pydantic import BaseModel
from models import engine, User
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from google.oauth2 import id_token
from google.auth.transport import requests
import os, secrets, resend
from datetime import datetime, timedelta

# In-memory token store { token: (email, expires_at) }
_reset_tokens: dict = {}

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

# ── Forgot Password ────────────────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == req.email)).first()
        # Always return 200 to prevent email enumeration attacks
        if not user or not user.hashed_password:
            return {"message": "If that email is registered, a reset link has been sent."}

    # Generate a secure token valid for 30 minutes
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(minutes=30)
    _reset_tokens[token] = (req.email, expires)

    # Send reset email via Resend
    resend.api_key = os.getenv("RESEND_API_KEY", "")
    frontend_url = os.getenv("FRONTEND_URL", "https://rupee-and-risk.vercel.app")
    reset_link = f"{frontend_url}/reset-password?token={token}"

    if resend.api_key:
        try:
            resend.Emails.send({
                "from": "noreply@rupeeandrisk.com",
                "to": req.email,
                "subject": "Reset your Rupee And Risk password",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 12px;">
                    <h2 style="color: #00e659;">Rupee And Risk</h2>
                    <p>You requested a password reset. Click the button below to set a new password. This link expires in <strong>30 minutes</strong>.</p>
                    <a href="{reset_link}" style="display:inline-block; background:#00e659; color:#000; font-weight:bold; padding:12px 28px; border-radius:8px; text-decoration:none; margin: 16px 0;">Reset My Password</a>
                    <p style="color:#666; font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
                """
            })
        except Exception:
            pass  # Fail silently — don't leak info

    return {"message": "If that email is registered, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    entry = _reset_tokens.get(req.token)
    if not entry:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link.")

    email, expires = entry
    if datetime.utcnow() > expires:
        del _reset_tokens[req.token]
        raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")

    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        user.hashed_password = get_password_hash(req.new_password)
        session.add(user)
        session.commit()

    del _reset_tokens[req.token]  # Invalidate token after use
    return {"message": "Password reset successfully. You can now log in."}
