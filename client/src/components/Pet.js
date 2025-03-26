import React from "react";
import {useNavigate} from "react-router-dom";


function Pet({pet, report}) {

    const navigate = useNavigate();
    const id = pet.id;

    function handlePetClick() {
        navigate(`/singlepet/${id}`)
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <h1 onClick = {handlePetClick} >{pet.name}</h1>
        <h2>{pet.breed}</h2>
        <p>{pet.description}</p>
        <h3>{report.report_type}</h3>
        <div>
            {pet.comments.map((comment) => 
                <div key={comment.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <h1>{comment.user.username}</h1>
                <p>{comment.content}</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default Pet;
