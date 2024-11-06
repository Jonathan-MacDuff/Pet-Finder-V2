import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";


function SinglePet() {

    const { id } = useParams();
    const navigate = useHistory();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/petform?id=${id}`)
            .then((r) => r.json())
            .then((data) => {
                console.log(data);
                setData(data)
            })
            .catch((error) => {
                console.error("Error fetching pet data:", error);
            });
    }, [id]);

    function handleUpdateClick(event) {
        event.preventDefault()
        fetch('/checksession')
        .then((r) => r.json())
        .then((user) => {
            if (user.id === data.report.user.id) {
                navigate.push(`/petupdate/${id}`)
            }
            else return "Please log in as this pet's user to update it"
        })       
    };

    function handleDeleteClick(event) {
        event.preventDefault();
        fetch('/checksession')
        .then((r) => r.json())
        .then((user) => {
            if (user.id === data.report.user.id) {       
                fetch('/petform', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id}),
                })
                .then(() => {console.log('Pet deleted successfully')})
            }
            else return "Please log in as this pet's user to delete it"
        });
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
        .then(() => {console.log('Pet sighting reported successfully')})
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
        </>
    );

};

export default SinglePet;