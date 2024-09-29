import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";


function SinglePet() {

    const { id } = useParams();
    const navigate = useHistory();
    const [pet, setPet] = useState(null);

    useEffect(() => {
        fetch(`/petform?id=${id}`)
        .then((r) => r.json())
        .then((data) => setPet(data));
        
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

    if (!pet) return <div>Loading...</div>

    return (
        <>
        <h1>{pet.name}</h1>
        <h2>{pet.breed}</h2>
        <p>{pet.description}</p>
        <button onClick = {handleUpdateClick} >Update</button>
        <button onClick = {handleDeleteClick} >Delete</button>
        </>
    );

};

export default SinglePet;