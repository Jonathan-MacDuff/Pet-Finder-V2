import { useFormik } from "formik";
import * as yup from "yup";
import { React, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/user";
import { BACKEND_URL } from '../config';


function SinglePet() {

    const {user, deletePet} = useContext(UserContext)
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [petMessage, setPetMessage] = useState('');
    const [commentMessage, setCommentMessage] = useState('');

    useEffect(() => {
        fetch(`${BACKEND_URL}/pets/${id}`)
        .then((r) => r.json())
        .then((data) => {
            setData(data)
        })
        .catch((error) => {
            console.error("Error fetching pet data:", error);
            setPetMessage(`Error fetching pet data: ${error}`)
        });
    }, [id]);

    function handleUpdateClick(event) {
        event.preventDefault()
        if (user.id === data.report.user.id) {
            navigate(`/pets/${id}/edit`)
        }
        else setPetMessage("Please log in as this pet's user to update it")
    };       

    function handleDeleteClick(event) {
        event.preventDefault();
        if (user.id === data.report.user.id) {       
            fetch(`${BACKEND_URL}/pets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id}),
            })
            .then(() => {
                deletePet(id)
                setPetMessage('Pet deleted successfully')})
                navigate('/mypets')
        }
        else setPetMessage("Please log in as this pet's user to delete it")
        };


    function handleSightingClick(event) {
        event.preventDefault()
        if (user.message) {
            setPetMessage('Please log in to report a sighting');
            return
        };
        fetch(`${BACKEND_URL}/pets/${id}/sightings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        })
        .then(() => {setPetMessage('Pet sighting reported successfully')})
    };

    function handleSightingsClick(event) {
        event.preventDefault();
        if (user.id === data.report.user.id) {
            navigate(`/pets/${id}/sightings`)
        }
        else setPetMessage("Please log in as this pet's user to view it's sightings")
    };

    const formSchema = yup.object().shape({
        content: yup.string().required('Comment can not be blank').max(100)
    });

    const formik = useFormik({
        initialValues: {
        content: ''
        },
        validationSchema:formSchema,
        onSubmit: (values) => {
            if (!user || user.message) {
                setCommentMessage('Please log in to leave a comment');
                return
            };
            fetch(`${BACKEND_URL}/pets/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({content: values.content}),
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
                setCommentMessage('Comment posted successfully.');
                formik.resetForm();
            })
            .catch((error) => {
                console.error("Error posting comment:", error);
            });
        },
    });

    if (!data) return <div>Loading...</div>

    if (user.id === data.report.user.id) {

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
            <p>{petMessage}</p>
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
                onChange={(event) => {
                    formik.handleChange(event); 
                    setCommentMessage('');
                    }}></input>
                <p style={{color:'red'}}>{formik.errors.content}</p>
                <p>{commentMessage}</p>
                <br/>
                <button type='submit'>Post</button>
            </form>
            </>
        )
    };

    if (user.message) {

        return (
            <>
            <h1>{data.pet.name}</h1>
            <h2>{data.pet.breed}</h2>
            <p>{data.pet.description}</p>
            <h3>{data.report.lost ? 'Lost' : 'Found'}</h3>
            <p>{petMessage}</p>
            <div>
                {data.pet.comments.map((comment) => 
                    <div key={comment.id}>
                    <h1>{comment.user.username}</h1>
                    <p>{comment.content}</p>
                    </div>
                )}
            </div>
            </>
        )
    };

    return (
        <>
        <h1>{data.pet.name}</h1>
        <h2>{data.pet.breed}</h2>
        <p>{data.pet.description}</p>
        <h3>{data.report.lost ? 'Lost' : 'Found'}</h3>
        <button onClick = {handleSightingClick}>Report Sighting</button>
        <p>{petMessage}</p>
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
            onChange={(event) => {
                formik.handleChange(event); 
                setCommentMessage('');
                }}></input>
            <p style={{color:'red'}}>{formik.errors.content}</p>
            <p>{commentMessage}</p>
            <br/>
            <button type='submit'>Post</button>
        </form>
        </>
    )
};

export default SinglePet;