#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Pet, Report

json=request.get_json()

class Signup(Resource):
    def post(self):
        username = json.get('username')
        password = json.get('password')
        if not username:
            return {'message': 'Username required'}, 422
        if not password:
            return {'message': 'Password required'}, 422
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201


class Pets(Resource):

    def get(self):
        pets = [pet.to_dict() for pet in Pet.query.all()]
        return make_response(pets, 200)

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Pets, '/pets', endpoint='pets')
api.add_resource(Signup, '/signup', endpoint='signup')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

