from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_socketio import SocketIO

db = SQLAlchemy()
migrate = Migrate()
api = Api()
cors = CORS()
socketio = SocketIO(cors_allowed_origins="*", transports=["websocket"])