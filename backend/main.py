from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import applications, auth



app = FastAPI()
app.include_router(applications.router)
app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/")
def root():
    return {"message": "CareerFlow API is running"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

