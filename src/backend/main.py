from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from login import login_user
import os
from dotenv import load_dotenv
from supabase import create_client
from fastapi import HTTPException
from supabase_auth.errors import AuthApiError
from pydantic import BaseModel


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY) 

class LoginModel(BaseModel):
    email: str
    password: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/")
def home():
    return {"message": "Backend is running!"}

@app.post("/api/login")
async def login(user: LoginModel):
    try:
        result = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return result
    except AuthApiError:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

