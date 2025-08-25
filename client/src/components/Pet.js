import React from "react";
import {useNavigate} from "react-router-dom";


function Pet({pet, report}) {

    const navigate = useNavigate();
    const id = pet.id;

    function handlePetClick() {
        navigate(`/pets/${id}`)
    };

    return (
        <div className="pet-card fade-in">
            <h1 onClick={handlePetClick} className="pet-name">{pet.name}</h1>
            <h2 className="pet-breed">{pet.breed}</h2>
            <p className="pet-description">{pet.description}</p>
            <h3 className="pet-status">{report.report_type}</h3>
            <div className="comments-section">
                {pet.comments && pet.comments.map((comment) => 
                    <div key={comment.id} className="comment-container">
                        <div className="comment-user">{comment.user.username}</div>
                        <p className="comment-content">{comment.content}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pet;
