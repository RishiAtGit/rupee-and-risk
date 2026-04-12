"""
auth.py — Firebase ID Token verification.
Replaces the old custom JWT/bcrypt system.
All user sessions are managed by Firebase. We just verify the token here.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from sqlmodel import Session, select
from models import engine, User
from firebase_admin_setup import get_firebase_app

# Ensure Firebase is initialized
get_firebase_app()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Verify Firebase ID Token and return the Supabase User object."""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        decoded = firebase_auth.verify_id_token(token)
        firebase_uid = decoded.get("uid")
        email = decoded.get("email")
        if not firebase_uid:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    with Session(engine) as session:
        # Look up by firebase_uid first; fall back to email for legacy users
        user = session.exec(select(User).where(User.firebase_uid == firebase_uid)).first()
        if not user and email:
            user = session.exec(select(User).where(User.email == email)).first()
            if user:
                # Link the firebase_uid to this existing user
                user.firebase_uid = firebase_uid
                session.add(user)
                session.commit()
                session.refresh(user)

        if not user:
            # Auto-create user record in Supabase for new Firebase sign-ups
            name = decoded.get("name", "")
            user = User(
                email=email or "",
                firebase_uid=firebase_uid,
                full_name=name,
                is_pro_member=False
            )
            session.add(user)
            session.commit()
            session.refresh(user)

        return user


def get_pro_user(current_user: User = Depends(get_current_user)) -> User:
    """Guard: only allow Pro members through."""
    if not current_user.is_pro_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Active Pro Subscription required to access this resource."
        )
    return current_user
