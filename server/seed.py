#!/usr/bin/env python3

# Standard library imports
import random
from random import randint, choice as rc
from datetime import datetime, timedelta


# Remote library imports
from faker import Faker

# Local imports
from __init__ import create_app
from extensions import db
from models import User, Pet, Report, Comment, Message

if __name__ == '__main__':
    fake = Faker()
    app = create_app()
    with app.app_context():
        print("Generating seed data...")
        
        print("Deleting all users...")
        User.query.delete()
        print("Deleting all pets...")
        Pet.query.delete()
        print("Deleting all reports...")
        Report.query.delete()
        print("Deleting all comments")
        Comment.query.delete()
        print("Deleting all messages")
        Message.query.delete()

        print("Generating users...")
        users = []
        usernames = []
        for i in range(20):
            username = fake.first_name()
            while username in usernames:
                username = fake.first_name()
            usernames.append(username)
            user = User(username=username)
            user.password = username
            users.append(user)
        db.session.add_all(users)
        db.session.commit()

        print("Generating pets...")
        pets = []
        for i in range(40):
            pet = Pet(
                name=fake.name(), 
                breed=fake.word(), 
                image_url=fake.url(),
                description=fake.paragraph(nb_sentences=1)
                )
            pets.append(pet)
        db.session.add_all(pets)
        db.session.commit()

        print("Generating reports...")
        reports = []
        for pet in pets:
            report = Report(
                report_type=rc(['found', 'lost', 'found', 'found']),
                user_id=rc([user.id for user in User.query.all()]),
                pet_id=pet.id
            )
            reports.append(report)
        db.session.add_all(reports)

        print("Generating comments...")
        comments = []
        for i in range(2):
            for pet in pets:
                comment = Comment(
                    content=fake.paragraph(nb_sentences=2),
                    user_id=rc([user.id for user in User.query.all()]),
                    pet_id=pet.id
                )
                comments.append(comment)
        db.session.add_all(comments)

        print("Generating messages...")
        messages = []
        for i in range (2):
            for user in users:
                message = Message(
                    content=fake.paragraph(nb_sentences=2),
                    timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                    sender_id=user.id,
                    recipient_id=rc([user.id for user in User.query.all()])
                )
                messages.append(message)
        db.session.add_all(messages)


        db.session.commit()
        print("Seed data generated successfully.")

