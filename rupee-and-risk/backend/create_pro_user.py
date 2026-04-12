from sqlmodel import Session, select
from models import engine, User
from auth import get_password_hash

def create_admin():
    with Session(engine) as session:
        # Check if test account exists
        existing_user = session.exec(select(User).where(User.email == "testpro@rupeeandrisk.com")).first()
        
        if existing_user:
            print("Test PRO account already exists!")
            if not existing_user.is_pro:
                existing_user.is_pro = True
                session.add(existing_user)
                session.commit()
                print("Upgraded existing test account to PRO.")
            return

        print("Creating brand new Test PRO account...")
        new_user = User(
            email="testpro@rupeeandrisk.com",
            # Hashing the password so auth API can verify it
            hashed_password=get_password_hash("ProTest123!"),
            is_pro=True
        )
        session.add(new_user)
        session.commit()
        print("Successfully created Test PRO account!")
        print("Email: testpro@rupeeandrisk.com")
        print("Password: ProTest123!")

if __name__ == "__main__":
    create_admin()
