import React from "react";
import {useHistory} from "react-router-dom";


function Pet({pet, report}) {

    const navigate = useHistory();
    const id = pet.id;

    function handlePetClick() {
        navigate.push(`/singlepet/${id}`)
    };

    return (
        <>
        <h1 onClick = {handlePetClick} >{pet.name}</h1>
        <h2>{pet.breed}</h2>
        <p>{pet.description}</p>
        <h3>{report.report_type}</h3>
        <div>
            {pet.comments.map((comment) => 
                <div key={comment.id}>
                <h1>{comment.user.username}</h1>
                <p>{comment.content}</p>
                </div>
            )}
        </div>
        </>
    );
};

export default Pet;
