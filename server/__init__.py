from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_restful import Api
from flask_socketio import SocketIO
from flask_session import Session
from datetime import datetime

db = SQLAlchemy()
api = Api()
socketio = SocketIO(cors_allowed_origins="*")
session = Session()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    CORS(app, supports_credentials=True)
    db.init_app(app)
    api.init_app(app)
    socketio.init_app(app)
    session.init_app(app)

    from .routes import bp as petfinder_bp
    app.register_blueprint(petfinder_bp, url_prefix="/petfinder")

    return app