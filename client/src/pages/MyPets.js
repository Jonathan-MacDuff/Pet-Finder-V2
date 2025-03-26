import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";
import Pet from "../components/Pet";

function MyPets() {

    const {user} = useContext(UserContext);
    const navigate = useNavigate()
    const [pets, setPets] = useState([]);


    useEffect(() => {
        if (user.message) {
            navigate('/');
            return;
        }
        if (user.reports) {
            const myPets = (user.reports
                .filter(report => report.type !== 'sighting')
                .map(report => ({pet: report.pet, report: report})))
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