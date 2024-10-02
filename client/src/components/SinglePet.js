import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";


function SinglePet() {

    const { id } = useParams();
    const navigate = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/petform?id=${id}`)
            .then((r) => r.json())
            .then((data) => setData(data))
            .catch((error) => {
                console.error("Error fetching pet data:", error);
            });
    }, [id]);

    function handleUpdateClick() {
        navigate.push(`/petupdate/${id}`)
    };

    function handleDeleteClick() {
        fetch('/petform', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        })
        .then((r) => r.json())
        .then(() => {console.log('Pet deleted successfully')})
    };

    if (!data) return <div>Loading...</div>

    return (
        <>
        <h1>{data.pet.name}</h1>
        <h2>{data.pet.breed}</h2>
        <p>{data.pet.description}</p>
        <h3>{data.report.lost ? 'Lost' : 'Found'}</h3>
        <button onClick = {handleUpdateClick} >Update</button>
        <button onClick = {handleDeleteClick} >Delete</button>
        </>
    );

};

export default SinglePet;