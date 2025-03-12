import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "../context/user";
import Pet from "../components/Pet";

function MyPets() {

    const {user} = useContext(UserContext);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        if (!user) return
        const myPets = (user.reports
            .filter(report => report.type !== 'sighting')
            .map(report => ({pet: report.pet, report: report})))
        setPets(myPets);
    }, [user]);

    return (
        <div>
            {pets.map(({pet, report}) => (
                <Pet pet={pet} report={report} key={pet.id}></Pet>
            ))}
        </div>
    )

}

export default MyPets;