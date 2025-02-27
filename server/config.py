# Standard library imports

# Remote library imports
from flask import Flask, session, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_socketio import SocketIO, emit
from datetime import datetime

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '123'

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

# Instantiate SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", transports=["websocket"])
app.json.compact = False

# SocketIO functions

@socketio.on('message')
def handle_message(data):
    from models import Message
    sender_id = data.get('sender_id')
    recipient_id = data.get('recipient_id')
    content = data.get('content')
    new_message = Message(sender_id=sender_id, recipient_id=recipient_id, content=content, timestamp=datetime.utcnow())
    db.session.add(new_message)
    db.session.commit()
    emit('message', {'id': new_message.id, 'sender': new_message.sender, 'content': new_message.content}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)