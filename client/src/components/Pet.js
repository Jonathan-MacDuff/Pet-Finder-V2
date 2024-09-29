import React from "react";
import {useHistory} from "react-router-dom"


function Pet({pet}) {

    const navigate = useHistory()
    const id = pet.id;

    function handlePetClick() {
        navigate.push(`/singlepet/${id}`)
    }

    return (
        <>
        <h1 onClick = {handlePetClick} >{pet.name}</h1>
        <h2>{pet.breed}</h2>
        <p>{pet.description}</p>
        </>
    );

};

export default Pet;