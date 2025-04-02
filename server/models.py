import bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db



class User(db.Model, SerializerMixin):

    __tablename__ = 'users'

    serialize_rules = ('-reports.user', '-comments.user', '-messages_sent', '-messages_received', '-pets.reports',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    pets = db.relationship('Pet', secondary='reports', viewonly=True)

    reports = db.relationship('Report', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', back_populates='sender', lazy='joined', cascade='all, delete-orphan')
    messages_received = db.relationship('Message', foreign_keys='Message.recipient_id', back_populates='recipient', lazy='joined', cascade='all, delete-orphan')
   
    @property
    def password(self):
        raise AttributeError("Password is not accessible!")

    @password.setter
    def password(self, plain_text_password):
        self._password_hash = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, plain_text_password):
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), self._password_hash.encode('utf-8'))
    
    def serialize(self):
        user_data = self.to_dict(only=('id', 'username'))
        # user_data['reports'] = [report.to_dict(only=('id', 'report_type')) for report in self.reports]            
        # user_data['comments'] = [comment.to_dict(only=('id', 'content')) for comment in self.comments]
        user_data['messages_sent'] = [message.to_dict(only=('id', 'content', 'timestamp')) for message in self.messages_sent]
        user_data['messages_received'] = [message.to_dict(only=('id', 'content', 'timestamp')) for message in self.messages_received]
        user_data['pets'] = [{
            **pet.to_dict(only=('id', 'name', 'breed', 'image_url', 'description')),
            'reports': [report.to_dict(only=('id', 'report_type')) for report in pet.reports],
            'comments': [{
                **comment.to_dict(only=('id', 'content')),
                'user': comment.user.to_dict(only=('id', 'username'))
            } for comment in pet.comments]
        } for pet in self.pets]

        return user_data

class Pet(db.Model, SerializerMixin):

    __tablename__ = 'pets'

    serialize_rules = ('-reports.pet', '-comments.pet',)
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    breed = db.Column(db.String)
    image_url = db.Column(db.String)
    description = db.Column(db.String)

    reports = db.relationship('Report', back_populates='pet', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='pet', cascade='all, delete-orphan')

    def serialize(self):
        pet_data = {
            'id': self.id,
            'name': self.name,
            'breed': self.breed,
            'image_url': self.image_url,
            'description': self.description
        }
        pet_data['reports'] = [{
            'id': report.id,
            'report_type': report.report_type
        } for report in self.reports]
        pet_data['comments'] = [{
            'id': comment.id,
            'content': comment.content,
            'user': {'id': comment.user.id, 'username': comment.user.username}
        } for comment in self.comments]

        return pet_data

class Report(db.Model, SerializerMixin):

    __tablename__ = 'reports'

    serialize_rules = ('-pet.reports', '-user.reports',)

    id = db.Column(db.Integer, primary_key=True)
    report_type = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'))

    user = db.relationship('User', back_populates='reports')
    pet = db.relationship('Pet', back_populates='reports')

    def serialize(self):
        report_data = {
            'id': self.id,
            'report_type': self.report_type,
            'user': {'id': self.user.id, 'username': self.user.username},
            'pet': {'id': self.pet.id, 'name': self.pet.name}
        }

        return report_data

class Comment(db.Model, SerializerMixin):
    
    __tablename__ = 'comments'

    serialize_rules = ('-user.comments', '-pet.comments', '-user.reports', '-pet.reports',)

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'))

    user = db.relationship('User', back_populates='comments')
    pet = db.relationship('Pet', back_populates='comments')

    def serialize(self):
        comment_data = {
            'id': self.id,
            'content': self.content,
            'user': {'id': self.user.id, 'username': self.user.username},
            'pet': {'id': self.pet.id, 'name': self.pet.name}
        }

        return comment_data

class Message(db.Model, SerializerMixin):

    __tablename__ = 'messages'

    serialize_rules = ('-sender.messages_sent', '-recipient.messages_received',)

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    sender = db.relationship('User', foreign_keys=[sender_id], back_populates='messages_sent')
    recipient = db.relationship('User', foreign_keys=[recipient_id], back_populates='messages_received')

    def serialize(self):
        message_data = {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'sender': {'id': self.sender.id, 'username': self.sender.username},
            'recipient': {'id': self.recipient.id, 'username': self.recipient.username}
        }

        return message_data