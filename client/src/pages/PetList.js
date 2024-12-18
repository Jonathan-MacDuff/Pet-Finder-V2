import {React, useState, useEffect} from "react";
import Pet from "../components/Pet";


function PetList() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        fetch("/pets")
            .then((r) => r.json())
            .then((petData) => {
                console.log('Fetched pet data:', petData);
                const petsWithReports = petData.map(pet => ({
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
