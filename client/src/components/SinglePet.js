import { useFormik } from "formik";
import * as yup from "yup";
import { React, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/user";


function SinglePet() {

    const {user, deletePet} = useContext(UserContext)
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`/petform?id=${id}`)
        .then((r) => r.json())
        .then((data) => {
            console.log(data)
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
            navigate(`/petupdate/${id}`)
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
                navigate('/mypets')
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
            navigate(`/sighting/${id}`)
        }
        else setMessage("Please log in as this pet's user to view it's sightings")
    };

    const formSchema = yup.object().shape({
        content: yup.string().required('Comment can not be blank').max(100)
    });

    const formik = useFormik({
        initialValues: {
        content: '',
        user_id: user.id,
        pet_id: id,
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
            .then((newComment) => {
                setData((prevData) => ({
                    ...prevData,
                    pet: {
                        ...prevData.pet,
                        comments: [...prevData.pet.comments, newComment]
                    }
                }));
                setMessage('Comment posted successfully.');
                formik.resetForm();
            })
        },
    });

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
            <input type='text' id='content' name='content' value={formik.values.content}
            onChange={formik.handleChange}></input>
            <br/>
            <button type='submit'>Post</button>
        </form>
        </>
    );

};

export default SinglePet;