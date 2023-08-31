from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()


def get_uuid():
    return uuid.uuid4().hex


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(11), primary_key=True, unique=True,
                   default=get_uuid)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)
    verification_code = db.Column(db.String(6))
    verification_expiration_time = db.Column(db.DateTime) 
