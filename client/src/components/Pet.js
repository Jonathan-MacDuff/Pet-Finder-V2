import React from "react";


function Pet({pet}) {

    const id = pet.id;

    function handleUpdateClick() {
        fetch('/petform', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({pet}),
        })
        .then((r) => r.json())
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