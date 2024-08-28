import React from "react";


function Pet({pet}) {
    return (
        <>
        <h1>{pet.name}</h1>
        <h2>{pet.breed}</h2>
        <p>{pet.description}</p>
        </>
    );

};

export default Pet;