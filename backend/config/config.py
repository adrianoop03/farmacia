from dotenv import load_dotenv
import os

load_dotenv()

#Configuracion de la base de datos
user = os.getenv("MYSQL_USER")
password = os.getenv("MYSQL_PASSWORD")
host = os.getenv("MYSQL_HOST")
database = os.getenv("MYSQL_DATABASE")
port = os.getenv("MYSQL_PORT")

DATABASE_CONNECTION_URI = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"

#Configuracion para flask-login
mail_server = 'smtp.gmail.com'
mail_port = 587
use_tls = True
mail_username = os.getenv("MAIL_USERNAME")
mail_password = os.getenv("MAIL_PASSWORD")

secret_key = os.getenv("SECRET_KEY")