"""
auth_routes.py — Firebase Auth
Firebase handles login, register, Google OAuth, and password reset.
Backend only exposes /me to return the user's PRO status from Supabase.
"""
from fastapi import APIRouter, Depends
from models import User
from auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user's profile and PRO status from Supabase."""
    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_pro_member": current_user.is_pro_member,
        "firebase_uid": current_user.firebase_uid,
    }
