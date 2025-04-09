#!/usr/bin/env python3

from flask import request, make_response, jsonify
from flask_restful import Resource
from sqlalchemy import or_

from config import app, db, api, session, socketio, datetime
from models import User, Pet, Report, Comment, Message



class Signup(Resource):
    def post(self):
        json=request.get_json()
        username = json.get('username')
        password = json.get('password')
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return make_response({"error": "Username already taken"}, 400)
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return make_response(new_user.serialize(), 201)
    
class Signin(Resource):
    def post(self):
        json=request.get_json()
        username = json.get('username')
        password = json.get('password')
        user = User.query.filter(User.username == username).first()
        if not user:
            return {'message': 'Invalid username'}, 422
        if not user.check_password(password):
            return {'message': 'Invalid password'}, 422
        session['user_id'] = user.id
        return make_response(user.serialize(), 200)
    
class Signout(Resource):
    def delete(self):
        session['user_id'] = 0
        return make_response({}, 200)

class CheckSession(Resource):

    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.serialize()
        else:
            return {'message': '401: Not Authorized'}, 401

class Pets(Resource):

    def get(self):
        pets = Pet.query.all()
        return make_response([pet.serialize() for pet in pets], 200)
    
    
    def post(self):
        if not session['user_id']:
            return {'message': 'Not Authorized'}, 401
        json = request.get_json()
        name = json.get('name')
        breed = json.get('breed')
        image_url = json.get('image_url')
        lost = json.get('lost')
        found = json.get('found')
        description = json.get('description')
        if (lost == True and found == True) or (lost == False and found == False):
            return {'message': 'Please select exactly one lost or found checkbox'}, 422
        new_pet = Pet(name=name,breed=breed,image_url=image_url,description=description)
        db.session.add(new_pet)
        db.session.commit()
        new_report = Report(user_id=session['user_id'],pet_id=new_pet.id,report_type=('lost' if lost else 'found'))
        db.session.add(new_report)
        db.session.commit()
        return make_response(new_pet.serialize(), 200)
    
class SinglePet(Resource):

    def get(self, id):
        pet = Pet.query.filter(Pet.id == id).first()
        if not pet:
            return {'message': 'Pet not found'}, 404
        report = Report.query.filter(Report.pet_id == id).first()
        return make_response({'pet': pet.serialize(), 'report': report.serialize()}, 200)
    
    def patch(self, id):
        json = request.get_json()
        user = User.query.filter(User.id == session['user_id']).first()
        pets = [pet for pet in user.pets if pet.id == id]
        reports = [report for report in user.reports if report.pet_id == id]
        if len(pets) == 0:
            return {'message': 'Not Authorized'}, 401
        pet = pets[0]
        report = reports[0]
        name = json.get('name')
        breed = json.get('breed')
        image_url = json.get('image_url')
        description = json.get('description')
        lost = json.get('lost')
        pet.name = name
        pet.breed = breed
        pet.image_url = image_url
        pet.description = description
        report.report_type = 'lost' if lost else 'found'
        db.session.add(pet)
        db.session.add(report)
        db.session.commit()
        return make_response(pet.serialize(), 200)
    
    def delete(self, id):
        user = User.query.filter(User.id == session['user_id']).first()
        pets = [pet for pet in user.pets if pet.id == id]
        if len(pets) == 0:
            return {'message': 'Not Authorized'}, 401
        db.session.delete(pets[0])
        db.session.commit()
        return {'message': 'Pet successfully deleted'}, 200
    
class Sightings(Resource):

    def get(self, id):
        if not session['user_id']:
            return {'message': 'Not Authorized'}, 401
        sightings = Report.query.filter(Report.pet_id == id).filter(Report.report_type == 'sighting').all()
        return make_response([sighting.serialize() for sighting in sightings], 200)

    def post(self, id):
        if not session['user_id']:
            return {'message': 'Not Authorized'}, 401

        if session.get('user_id'):
            sighting_report = Report(user_id=session.get('user_id'), pet_id=id, report_type=('sighting'))
            db.session.add(sighting_report)
            db.session.commit()
            return make_response(sighting_report.serialize(), 200)
        else:
            return {'message': 'Please log in to report a sighting'}, 422
        
class Comments(Resource):

    # def get(self):
    #     pet_id = request.args.get('id')
    #     comments = Comment.query.filter(Comment.pet_id == pet_id).all()
    #     return make_response([comment.serialize() for comment in comments], 200)
    
    def post(self, id):
        if not session['user_id']:
            return {'message': 'Not Authorized'}, 401
        json = request.get_json()
        content = json.get('content')
        user_id = session['user_id']
        comment = Comment(content=content, user_id=user_id, pet_id=id)
        db.session.add(comment)
        db.session.commit()
        return make_response(comment.serialize(), 200)

    # def patch(self):
    #     json = request.get_json()
    #     id = json.get('id')
    #     comment = Comment.query.filter(Comment.id == id).first()
    #     if not session['user_id'] == comment.user.id:
    #         return {'message': 'Not Authorized'}, 401
    #     content = json.get('content')
    #     comment.content = content
    #     db.session.add(comment)
    #     db.session.commit()
    #     return make_response(comment.serialize(), 200)
    
    # def delete(self):
    #     json = request.get_json()
    #     id = json.get('id')
    #     comment = Comment.query.filter(Comment.id == id).first()
    #     if not session['user_id'] == comment.user.id:
    #         return {'message': 'Not Authorized'}, 401
    #     db.session.delete(comment)
    #     db.session.commit()
    #     return {'message': 'Comment successfully deleted'}, 200
    
class Messages(Resource):

    def get(self):
        if not session['user_id']:
            return {'message': 'Not Authorized'}, 401
        user_id = session['user_id']
        messages = Message.query.filter(
            or_(Message.recipient_id == user_id, Message.sender_id == user_id)).all()
        return jsonify([message.serialize() for message in messages])
    
    def post(self):
        if not session['user_id']:
            return {'message': 'Not Authorized'}, 401
        json = request.get_json()
        content = json.get('content')
        timestamp = datetime.fromisoformat(json.get('timestamp').replace('Z', ''))
        sender_id = json.get('sender_id')
        recipient = User.query.filter(User.username == json.get('recipient')).first()
        recipient_id = recipient.id
        newMessage = Message(sender_id=sender_id, recipient_id=recipient_id, content=content, timestamp=timestamp)
        db.session.add(newMessage)
        db.session.commit()
        return make_response(newMessage.serialize(), 200)


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Pets, '/pets', endpoint='pets')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Signin, '/signin', endpoint='signin')
api.add_resource(Signout, '/signout', endpoint='signout')
api.add_resource(SinglePet, '/pets/<int:id>', endpoint='pets/<int:id>')
api.add_resource(Sightings, '/pets/<int:id>/sightings', endpoint='pets/<int:id>/sightings')
api.add_resource(Comments, '/pets/<int:id>/comments', endpoint='/pets/<int:id>/comments')
api.add_resource(Messages, '/messages', endpoint='messages')
api.add_resource(CheckSession, '/checksession')


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5555)

