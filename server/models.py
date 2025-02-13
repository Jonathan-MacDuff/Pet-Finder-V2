from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db



class User(db.Model, SerializerMixin):

    __tablename__ = 'users'

    serialize_rules = ('-reports.user', '-comments.user', '-messages_sent.sender', '-messages_received.recipient',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(8))

    reports = db.relationship('Report', back_populates='user', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', back_populates='sender', cascade='all, delete-orphan')
    messages_received = db.relationship('Message', foreign_keys='Message.recipient_id', back_populates='recipient', cascade='all, delete-orphan')

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

class Report(db.Model, SerializerMixin):

    __tablename__ = 'reports'

    serialize_rules = ('-pet.reports', '-user.reports',)

    id = db.Column(db.Integer, primary_key=True)
    report_type = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'))

    user = db.relationship('User', back_populates='reports')
    pet = db.relationship('Pet', back_populates='reports')

class Comment(db.Model, SerializerMixin):
    
    __tablename__ = 'comments'

    serialize_rules = ('-user.comments', '-pet.comments', '-user.reports', '-pet.reports',)

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'))

    user = db.relationship('User', back_populates='comments')
    pet = db.relationship('Pet', back_populates='comments')

class Message(db.Model, SerializerMixin):

    __tablename__ = 'messages'

    serialize_rules = ('-sender.messages_sent', '-recipient.messages_received',)

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    sender = db.relationship('User', foreign_keys=[sender_id], back_populates='messages_sent')
    recipient = db.relationship('User', foreign_keys=[recipient_id], back_populates='messages_received')