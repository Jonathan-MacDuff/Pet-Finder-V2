import {React, useState, useEffect} from "react";
import Pet from "../components/Pet";


function PetList() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        fetch("/pets")
            .then((r) => r.json())
            .then((r) => setPets(r));
    }, []);

    return (
        pets.map((pet) => (
            <Pet pet={pet} key={pet.id}></Pet>
        ))
    )
}

export default PetList;
