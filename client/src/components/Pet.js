import React from "react";
import {useHistory} from "react-router-dom"


function Pet({pet}) {

    const navigate = useHistory()
    const id = pet.id;

    function handleUpdateClick() {
        navigate.push(`/petupdate/${id}`)
    }

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
    }

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

export default Pet;