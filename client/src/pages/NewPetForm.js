import {React, useState} from "react";

function NewPetForm() {

    const [name, setName] = useState('')
    const [breed, setBreed] = useState('')
    const [image_url, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [lost, setLost] = useState(false)
    const [found, setFound] = useState(false)

    function handleSubmit(e) {
        e.preventDefault();
        fetch('/petform', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, breed, image_url, description, lost, found}),
        });
    };

    return (
        <form onSubmit = {handleSubmit}>
            <label>Name
                <input type='text' id='name' value={name}
                    onChange={(e) => setName(e.target.value)}/>
            </label>
            <label>Breed
                <input type='text' id='breed' value={breed}
                    onChange={(e) => setBreed(e.target.value)}/>
            </label>
            <label>Image
                <input type='text' id='image' value={image_url}
                    onChange={(e) => setImage(e.target.value)}/>
            </label>
            <label>Description
                <input type='text' id='description' value={description}
                    onChange={(e) => setDescription(e.target.value)}/>
            </label>
            <label>Lost
                <input type='checkbox' id='lost' checked={lost}
                    onChange={(e) => setLost(e.target.checked)}/>
            </label>
            <label>Found
                <input type='checkbox' id='found' checked={found}
                    onChange={(e) => setFound(e.target.checked)}/>
            </label>
            <button type='submit'>Submit</button>
        </form>
    );
};

export default NewPetForm