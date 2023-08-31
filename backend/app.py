from flask import Flask
from flask_cors import CORS
from views import api_bp
from flask_swagger_ui import get_swaggerui_blueprint
from models import db
from flask_bcrypt import Bcrypt
from flask_mail import Mail


app = Flask(__name__)
cors = CORS(app)


app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'omaraguil4@gmail.com'
app.config['MAIL_PASSWORD'] = 'hymwfsiefqpdmebx'
app.config['MAIL_USE_TLS'] = True
mail = Mail(app)

app.config["SECRET_KEY"] = "omar"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///validator.db"
SQLALCHEMY_TRACK_MODIFICATION = False
SQLALCHEMY_ECHO = True

bcrypt = Bcrypt(app)

db.init_app(app)

with app.app_context():
    db.create_all()

SWAGGER_URL = "/swagger"
API_URL = "/static/swagger.yaml"
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL, API_URL, config={
        "app_name": "Seans-Python-Flask-REST-Geoprod"}
)

app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
app.register_blueprint(api_bp)

if __name__ == '__main__':
    app.run(debug=True)
