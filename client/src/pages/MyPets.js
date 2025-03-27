import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";
import Pet from "../components/Pet";

function MyPets() {

    const {user} = useContext(UserContext);
    const navigate = useNavigate()
    const [pets, setPets] = useState([]);


    useEffect(() => {
        console.log(user)
        if (user.message) {
            navigate('/');
            return;
        }
        if (user.pets) {
            console.log(user.pets)
            const myPets = (user.pets
                .filter(pet => pet.reports[0].report_type !== 'sighting')
                .map(pet => ({pet: pet, report: pet.reports[0]})))
            setPets(myPets);
        }
        else setPets([])
    }, [user, navigate]);

    return (
        <div>
            {pets.map(({pet, report}) => (
                <Pet pet={pet} report={report} key={pet.id}></Pet>
            ))}
        </div>
    )

}

export default MyPets;