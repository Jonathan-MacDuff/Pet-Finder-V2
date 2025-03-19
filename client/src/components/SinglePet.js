import { useFormik } from "formik";
import * as yup from "yup";
import { React, useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "../context/user";


function SinglePet() {

    const {user, deletePet, updatePet} = useContext(UserContext)
    const { id } = useParams();
    const navigate = useHistory();
    const [data, setData] = useState(null);
    const [message, setMessage] = useState('');
    // const [username, setUsername] = useState(user.username)

    useEffect(() => {
        fetch(`/petform?id=${id}`)
        .then((r) => r.json())
        .then((data) => {
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
            .then(() => {
                deletePet(id)
                setMessage('Pet deleted successfully')})
                navigate.push('/mypets')
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

    //
    const formSchema = yup.object().shape({
        // username: user.username,
        comment: yup.string().required('Comment can not be blank').max(100)
    });

    const formik = useFormik({
        initialValues: {
        // username: user.username,
        comment: '',
        },
        validationSchema:formSchema,
        onSubmit: (values) => {
            fetch('/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values, null, 2),
            })
            .then((r) => r.json())
            .then(() => setMessage(`Comment posted successfully.`)) 
        },
    });
    //

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
        <div>
            {data.pet.comments.map((comment) => 
                <div key={comment.id}>
                <h1>{comment.user.username}</h1>
                <p>{comment.content}</p>
                </div>
            )}
        </div>
        <form onSubmit={formik.handleSubmit}>
            <label>Comment</label>
            <br/>
            <input type='text' id='comment' name='comment' value={formik.values.comment}
            onChange={formik.handleChange}></input>
            <br/>
            <button type='submit'>Post</button>
        </form>
        </>
    );

};

export default SinglePet;