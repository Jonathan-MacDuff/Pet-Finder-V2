import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";


function SinglePet({user}) {

    const { id } = useParams();
    const navigate = useHistory();
    const [data, setData] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`/petform?id=${id}`)
        .then((r) => r.json())
        .then((data) => {
            console.log(data);
            setData(data)
        })
        .catch((error) => {
            console.error("Error fetching pet data:", error);
            setMessage(`Error fetching pet data: ${error}`)
        });
    }, [id]);

    function handleUpdateClick(event) {
        event.preventDefault()
        if (user.id === data.report.user.id) {
            navigate.push(`/petupdate/${id}`)
        }
        else setMessage("Please log in as this pet's user to update it")
    };       

    function handleDeleteClick(event) {
        event.preventDefault();
        if (user.id === data.report.user.id) {       
            fetch('/petform', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id}),
            })
            .then(() => {setMessage('Pet deleted successfully')})
        }
        else setMessage("Please log in as this pet's user to delete it")
        };


    function handleSightingClick(event) {
        event.preventDefault()
        fetch('/sighting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        })
        .then(() => {setMessage('Pet sighting reported successfully')})
    };

    function handleSightingsClick(event) {
        event.preventDefault();
        if (user.id === data.report.user.id) {
            navigate.push(`/sighting/${id}`)
        }
        else setMessage("Please log in as this pet's user to view it's sightings")
    };


    if (!data) return <div>Loading...</div>

    return (
        <>
        <h1>{data.pet.name}</h1>
        <h2>{data.pet.breed}</h2>
        <p>{data.pet.description}</p>
        <h3>{data.report.lost ? 'Lost' : 'Found'}</h3>
        <button onClick = {handleSightingClick}>Report Sighting</button>
        <button onClick = {handleUpdateClick} >Update</button>
        <button onClick = {handleDeleteClick} >Delete</button>
        <button onClick = {handleSightingsClick}>View Sightings</button>
        <p>{message}</p>
        </>
    );

};

export default SinglePet;