#!/usr/bin/env python3

from flask import request, make_response, jsonify
from flask_restful import Resource

from config import app, db, api, session
from models import User, Pet, Report



class Signup(Resource):
    def post(self):
        json=request.get_json()
        username = json.get('username')
        password = json.get('password')
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)
    
class Signin(Resource):
    def post(self):
        json=request.get_json()
        username = json.get('username')
        password = json.get('password')
        user = User.query.filter(User.username == username).first()
        if not user:
            return {'message': 'Invalid username'}, 422
        if not user.password == password:
            return {'message': 'Invalid password'}, 422
        session['user_id'] = user.id
        return make_response(user.to_dict(), 200)
    
class CheckSession(Resource):

    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

class Pets(Resource):

    def get(self):
        pets = Pet.query.all()
        return make_response([pet.to_dict() for pet in pets], 200)
    
class Petform(Resource):

    def get(self):
        id = request.args.get('id')

        pet = Pet.query.filter(Pet.id == id).first()
        report = Report.query.filter(Report.pet_id == id).first()
        
        return make_response({'pet': pet.to_dict(), 'report': report.to_dict()}, 200)
    
    def post(self):
        json = request.get_json()
        name = json.get('name')
        breed = json.get('breed')
        image_url = json.get('image_url')
        lost = json.get('lost')
        found = json.get('found')
        description = json.get('description')
        if not session['user_id']:
            return {'message': 'Please log in to continue'}, 422
        if (lost == True and found == True) or (lost == False and found == False):
            return {'message': 'Please select exactly one lost or found checkbox'}, 422
        new_pet = Pet(name=name,breed=breed,image_url=image_url,description=description)
        db.session.add(new_pet)
        db.session.commit()
        new_report = Report(user_id=session['user_id'],pet_id=new_pet.id,report_type=('lost' if lost else 'found'))
        db.session.add(new_report)
        db.session.commit()
        return make_response(new_pet.to_dict(), 200)
    
    def patch(self):
        json = request.get_json()
        id = json.get('id')
        pet = Pet.query.filter(Pet.id == id).first()
        report = Report.query.filter(Report.pet_id == id).first()
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
        return make_response(pet.to_dict(), 200)
    
    def delete(self):
        json = request.get_json()
        id = json.get('id')
        pet = Pet.query.filter(Pet.id == id).first()
        db.session.delete(pet)
        db.session.commit()
        return {'message': 'Pet successfully deleted'}, 200





@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Pets, '/pets', endpoint='pets')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Signin, '/signin', endpoint='signin')
api.add_resource(Petform, '/petform', endpoint='petform')
api.add_resource(CheckSession, '/checksession')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

