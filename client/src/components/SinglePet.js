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
            <div className="container">
                <div className="pet-details">
                    <h1 className="pet-name">{data.pet.name}</h1>
                    <h2 className="pet-breed">{data.pet.breed}</h2>
                    <p className="pet-description">{data.pet.description}</p>
                    <h3 className="pet-status">{data.report.lost ? 'Lost' : 'Found'}</h3>
                    <button onClick={handleSightingClick}>Report Sighting</button>
                    <button onClick={handleUpdateClick}>Update</button>
                    <button onClick={handleDeleteClick}>Delete</button>
                    <button onClick={handleSightingsClick}>View Sightings</button>
                    {petMessage && <p className="pet-message">{petMessage}</p>}
                </div>
                
                <div className="comments-section">
                    <h3>Comments</h3>
                    {data.pet.comments && data.pet.comments.map((comment) => 
                        <div key={comment.id} className="comment-container fade-in">
                            <div className="comment-user">{comment.user.username}</div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    )}
                </div>
                
                <form onSubmit={formik.handleSubmit} className="comment-form">
                    <div className="form-group">
                        <label htmlFor="content">Add a Comment</label>
                        <input 
                            type="text" 
                            id="content" 
                            name="content" 
                            value={formik.values.content}
                            onChange={(event) => {
                                formik.handleChange(event); 
                                setCommentMessage('');
                            }}
                            placeholder="Share your thoughts..."
                        />
                        {formik.errors.content && <p className="error-message" style={{color:'red', fontWeight:'bold'}}>{formik.errors.content}</p>}
                        {commentMessage && <p className="success-message">{commentMessage}</p>}
                    </div>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        )
    };

    if (user.message) {

        return (
            <div className="container">
                <div className="pet-details">
                    <h1 className="pet-name">{data.pet.name}</h1>
                    <h2 className="pet-breed">{data.pet.breed}</h2>
                    <p className="pet-description">{data.pet.description}</p>
                    <h3 className="pet-status">{data.report.lost ? 'Lost' : 'Found'}</h3>
                    {petMessage && <p className="pet-message">{petMessage}</p>}
                </div>
                
                <div className="comments-section">
                    <h3>Comments</h3>
                    {data.pet.comments && data.pet.comments.map((comment) => 
                        <div key={comment.id} className="comment-container fade-in">
                            <div className="comment-user">{comment.user.username}</div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    };

    return (
        <div className="container">
            <div className="pet-details">
                <h1 className="pet-name">{data.pet.name}</h1>
                <h2 className="pet-breed">{data.pet.breed}</h2>
                <p className="pet-description">{data.pet.description}</p>
                <h3 className="pet-status">{data.report.lost ? 'Lost' : 'Found'}</h3>
                <button onClick={handleSightingClick}>Report Sighting</button>
                {petMessage && <p className="pet-message">{petMessage}</p>}
            </div>
            
            <div className="comments-section">
                <h3>Comments</h3>
                {data.pet.comments && data.pet.comments.map((comment) => 
                    <div key={comment.id} className="comment-container fade-in">
                        <div className="comment-user">{comment.user.username}</div>
                        <p className="comment-content">{comment.content}</p>
                    </div>
                )}
            </div>
            
            <form onSubmit={formik.handleSubmit} className="comment-form">
                <div className="form-group">
                    <label htmlFor="content">Add a Comment</label>
                    <input 
                        type="text" 
                        id="content" 
                        name="content" 
                        value={formik.values.content}
                        onChange={(event) => {
                            formik.handleChange(event); 
                            setCommentMessage('');
                        }}
                        placeholder="Share your thoughts..."
                    />
                    {formik.errors.content && <p className="error-message">{formik.errors.content}</p>}
                    {commentMessage && <p className="success-message">{commentMessage}</p>}
                </div>
                <button type="submit">Post Comment</button>
            </form>
        </div>
    )
};

export default SinglePet;