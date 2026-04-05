import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import razorpay
from sqlmodel import Session, select
from models import engine, User
from auth import get_current_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])

# Typically loaded from ENV
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_dummy_key_id_123")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "dummy_secret_abc")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class OrderCreateRequest(BaseModel):
    amount: int  # in paise
    currency: str = "INR"

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
def create_order(req: OrderCreateRequest, current_user: User = Depends(get_current_user)):
    try:
        # Create order in Razorpay
        data = {
            "amount": req.amount,
            "currency": req.currency,
            "receipt": f"receipt_{current_user.id}"
        }
        
        # In actual Razorpay, this hits the API. If we're using dummy keys, it will fail.
        # We'll mock the response if the keys are dummy to allow testing the flow.
        if RAZORPAY_KEY_ID.startswith("rzp_test_dummy"):
            return {
                "id": "order_dummy_9999",
                "entity": "order",
                "amount": req.amount,
                "currency": req.currency,
                "status": "created"
            }
            
        order = client.order.create(data=data)
        return order
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
def verify_payment(req: PaymentVerifyRequest, current_user: User = Depends(get_current_user)):
    try:
        # In actual production, verify signature
        if not RAZORPAY_KEY_ID.startswith("rzp_test_dummy"):
            client.utility.verify_payment_signature({
                'razorpay_order_id': req.razorpay_order_id,
                'razorpay_payment_id': req.razorpay_payment_id,
                'razorpay_signature': req.razorpay_signature
            })
            
        # Signature is valid (or mocked), grant Pro Access
        with Session(engine) as session:
            user = session.exec(select(User).where(User.id == current_user.id)).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
                
            user.is_pro_member = True
            session.add(user)
            session.commit()
            
        return {"status": "success", "message": "Pro Access Granted", "is_pro_member": True}
        
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
