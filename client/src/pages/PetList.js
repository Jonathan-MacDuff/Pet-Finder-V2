import {React, useState, useEffect} from "react";
import Pet from "../components/Pet";
import { BACKEND_URL } from '../config';


function PetList() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/pets`)
            .then((r) => r.json())
            .then((petData) => {
                const petsWithReports = petData
                    .filter(pet => pet.reports && pet.reports[0])
                    .map(pet => ({
                        pet,
                        report: pet.reports[0]
                    }));
                setPets(petsWithReports);
            })
            .catch((error) => console.error('Error fetching pets:', error));
    }, []);

    return (
        <div>
            {pets.map(({pet, report}) => (
                <Pet pet={pet} report={report} key={pet.id}></Pet>
            ))}
        </div>
    )
};

export default PetList;
