import {React, useState, useContext, useEffect} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../context/user";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from '../config';

function NewPetForm() {

    const {addPet, user} = useContext(UserContext);
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        if (user.message) {
            navigate('/');
            return;
        }
    }, [navigate, user.message])

    const formSchema = yup.object().shape({
        name: yup.string().required('Name is required, enter "N/A" if unknown').max(20),
        breed: yup.string().required('Breed is required, enter "N/A" if unknown').max(20),
        image_url: yup.string().required('Image is required, enter "N/A" if unavailable').max(50),
        description: yup.string().required('Description is required').max(200),
        lost: yup.boolean(),
        found: yup.boolean(),
    }).test('lost-or-found', 'Please select either "Lost" or "Found", but not both', function (values) {
        if (values.lost === values.found) {
            return this.createError({path: 'lost-or-found', message: 'Please select either "Lost" or "Found", but not both'})
        }
        else return true;
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            breed: '',
            image_url: '',
            description: '',
            lost: false,
            found: false,
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`${BACKEND_URL}/pets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values, null, 2),
            })
            .then((response) => response.json())
            .then((newPet) => {
                addPet(newPet)
                setMessage('Pet created successfully')
            })
        }
    });

    return (
        <form onSubmit = {formik.handleSubmit}>
            <label>Name
                <input type='text' id='name' name='name' value={formik.values.name}
                    onChange={formik.handleChange}/>
                <p style={{color:'red'}}>{formik.errors.name}</p>
            </label>
            <label>Breed
                <input type='text' id='breed' name='breed' value={formik.values.breed}
                    onChange={formik.handleChange}/>
                <p style={{color:'red'}}>{formik.errors.breed}</p>
            </label>
            <label>Image
                <input type='text' id='image' name='image_url' value={formik.values.image_url}
                    onChange={formik.handleChange}/>
                <p style={{color:'red'}}>{formik.errors.image_url}</p>
            </label>
            <label>Description
                <input type='text' id='description' name='description' value={formik.values.description}
                    onChange={formik.handleChange}/>
                <p style={{color:'red'}}>{formik.errors.description}</p>
            </label>
            <label>Lost
                <input type='checkbox' id='lost' name='lost' checked={formik.values.lost}
                    onChange={formik.handleChange}/>
                <p style={{color:'red'}}>{formik.errors.lost}</p>
            </label>
            <label>Found
                <input type='checkbox' id='found' name='found' checked={formik.values.found}
                    onChange={formik.handleChange}/>
                <p style={{color:'red'}}>{formik.errors.found}</p>
            </label>
            {formik.errors['lost-or-found'] && (
                <p style={{ color: 'red' }}>{formik.errors['lost-or-found']}</p>
            )}
            <p>{message}</p>
            <button type='submit'>Submit</button>
        </form>
    );
};

export default NewPetForm