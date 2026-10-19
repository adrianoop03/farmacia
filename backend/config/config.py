import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER") or os.getenv("MYSQL_USER", "")
DB_PASSWORD = os.getenv("DB_PASSWORD") or os.getenv("MYSQL_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST") or os.getenv("MYSQL_HOST", "")
DB_PORT = os.getenv("DB_PORT") or os.getenv("MYSQL_PORT", "")
DB_NAME = os.getenv("DB_NAME") or os.getenv("MYSQL_DATABASE", "")

SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    "?charset=utf8mb4"
)
SQLALCHEMY_TRACK_MODIFICATIONS = False
DEBUG = True
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
