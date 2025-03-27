import React, { useState, useEffect } from "react";

const UserContext = React.createContext();


function UserProvider({ children }) {
    const [user, setUser] = useState({});

    function checkSession() {
        fetch('/checksession')
        .then((r) => r.json())
        .then((data) => setUser(data))
    }

    useEffect(() => {
        checkSession()
      }, []);
    
    function addPet(newPet) {
        setUser(prevUser => ({
            ...prevUser,
            pets: [...prevUser.pets, newPet]
        }));
    };

    function updatePet(updatedPet) {
        const updatedPets = user.pets.map(pet =>
            pet.id === updatedPet.id ? updatedPet : pet
        );
        setUser(prevUser => ({
            ...prevUser,
            pets: [...updatedPets]
        }));
    };

    function deletePet(id) {
        const updatedPets = user.pets.filter(pet => pet.id !== Number(id));
        setUser(prevUser => ({
            ...prevUser,
            pets: [...updatedPets]
        }));
    };
    return <UserContext.Provider value={{ user, setUser, deletePet, addPet, updatePet, checkSession }}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };