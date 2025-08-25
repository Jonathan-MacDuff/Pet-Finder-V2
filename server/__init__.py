from flask import Flask
from config import Config
from extensions import db, migrate, api, cors, socketio
from routes import register_routes
from datetime import datetime
import os

def create_app():
    app = Flask(__name__, instance_relative_config=True, instance_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance'))
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*", transports=["websocket"])
    register_routes(api)
    api.init_app(app)

    @socketio.on('message')
    def handle_message(data):
        from models import Message
        sender_id = data.get('sender_id')
        recipient_id = data.get('recipient_id')
        content = data.get('content')
        timestamp = datetime.fromisoformat(data.get('timestamp').replace('Z', ''))
        new_message = Message(sender_id=sender_id, recipient_id=recipient_id, content=content, timestamp=timestamp)
        db.session.add(new_message)
        db.session.commit()
        saved_message = {
            'id': new_message.id,
            'sender': {
                'id': new_message.sender.id,
                'username': new_message.sender.username
            },
            'recipient_id': new_message.recipient_id,
            'content': new_message.content,
            'timestamp': new_message.timestamp.isoformat()
        }
        socketio.emit('message', saved_message, broadcast=True)

    return app