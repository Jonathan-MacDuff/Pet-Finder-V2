# Pet Finder

## Introduction

This is an app to report lost and found pets. A user can create an account, and generate reports on lost or found pets associated with their account. They can also report sightings of an existing pet in the database, as well as leave comments on them, and message other users in real-time.

# Backend

### app.py

This file provides resources for the front end to interact with the database. The Signup resource generates a new user to the database based on user input. The Signin resource allows users to sign in, storing their user id in the current session. The Signout resource removes the user id from the session. The CheckSession resource checks what the current session id is to validate certain restricted functionality. The Pets resource returns all pets in the database. The Petform resource can return a single pet, create a new pet and associated report, update a pet and associated report, or delete a pet and associated report. The Sightings reource adds or displays sightings of the referenced pet.

### models.py

This file defines the models for User, Pet, and Report to add data to the database.

### config.py

This file holds imports used in multiple other files to avoid circular imports.

### seed.py

This file is used to generate random information to fill the database for testing purposes.

# Frontend

## App.js

This file sets up the various pathing for the frontend.

## Conversation.js

This file utilizes FlaskSocketIO to allow users to communicate in real time.

## NavBar.js

This file defines a NavBar to be used on all pages for quick navigation.

## Pet.js

This file displays a simplified single Pet, and is used to display all pets in sequence.

## PetSighting.js

This file allows a user to display users who have reported a sighting of the referenced pet.

## PetUpdateForm.js

This file allows a user to update an existing Pet associated with their account.

## SinglePet.js

This file allows for a more detailed view of a single Pet, as well as update and delete functionality for the user who reported this pet. The pet owner can also view all sightings of the pet.

## user.js

This file stores the current user in global state for access in a variety of other components.

## Home.js

This is a simple homepage, to be added to later.

## Messages.js

This page allows the current user to view all of their conversations with other users, and navigation to each related conversation.

## MyPets.js

This page displays the current user's pets, and allows navigation to each of these pets' SinglePet page.

## NewPetForm.js

This page allows a user to create a new pet and report.

## PetList.js

This page displays all pets in the database.

## Signin.js

This page allows an existing user to sign in.

## Signup.js

This page allows a new user to create an account.

## Conclusion

Thanks for your interest in this app! If you have any questions, feel free to reach out to me at (jonathan.macduff@outlook.com). Happy coding!

## Resources

- [Blog](https://medium.com/@jonathan-macduff/building-a-pet-finder-19a3e57a04d5)