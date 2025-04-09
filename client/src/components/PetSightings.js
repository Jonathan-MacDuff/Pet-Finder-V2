import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";


function PetSightings() {

    const { id } = useParams();
    const [data, setData] = useState([])

    useEffect(() => {
        fetch(`/pets/${id}/sightings`)
        .then((r) => r.json())
        .then((data) => {
            console.log(data);
            setData(data)});
    }, [id]);

    function renderSightings() {
        const sightings = [];        
        for (const key in data) {
            if (data[key].report_type === "sighting") {
                sightings.push(
                    <li key={key}>{data[key].user.username}</li>
                );
            }
        }        
        return sightings.length > 0 ? sightings : <p>No sightings reported.</p>;
    };

    return (
        <ul>
            {renderSightings()}
        </ul>
    );
};

export default PetSightings;