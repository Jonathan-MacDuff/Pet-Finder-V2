#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api, session
from models import User, Pet, Report



class Signup(Resource):
    def post(self):
        json=request.get_json()
        username = json.get('username')
        password = json.get('password')
        if not username:
            return {'message': 'Username required'}, 422
        if not password:
            return {'message': 'Password required'}, 422
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)
    
class Signin(Resource):
    def post(self):
        json=request.get_json()
        username = json.get('username')
        password = json.get('password')
        if not username:
            return {'message': 'Username required'}, 422
        if not password:
            return {'message': 'Password required'}, 422
        user = User.query.filter(User.username == username).first()
        if not user:
            return {'message': 'Invalid username'}, 422
        if not user.password == password:
            return {'message': 'Invalid password'}, 422
        session['user_id'] = user.id
        return make_response(user.to_dict(), 200)


class Pets(Resource):

    def get(self):
        pets = [pet.to_dict() for pet in Pet.query.all()]
        return make_response(pets, 200)
    
class Petform(Resource):
    def post(self):
        json = request.get_json()
        name = json.get('name')
        breed = json.get('breed')
        image = json.get('image')
        lost = json.get('lost')
        found = json.get('found')
        description = json.get('description')
        if not session['user_id']:
            return {'message': 'Please log in to continue'}, 422
        if (lost == True and found == True) or (lost == False and found == False):
            return {'message': 'Please select exactly one lost or found checkbox'}, 422
        new_pet = Pet(name=name,breed=breed,image_url=image,description=description)
        db.session.add(new_pet)
        db.session.commit()
        new_report = Report(user_id=session['user_id'],pet_id=new_pet.id,report_type=('lost' if lost else 'found'))
        db.session.add(new_report)
        db.session.commit()
        return make_response(new_pet.to_dict(), 200)



@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Pets, '/pets', endpoint='pets')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Signin, '/signin', endpoint='signin')
api.add_resource(Petform, '/petform', endpoint='petform')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

