import {React, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";


function PetUpdateForm({user}) {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`/petform?id=${id}`)
        .then((r) => r.json())
        .then((data) => {
            console.log(data);
            setData(data)});
    }, [id]);

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
            id: data?.pet?.id || '',
            name: data?.pet?.name || '',
            breed: data?.pet?.breed || '',
            image_url: data?.pet?.image_url || '',
            description: data?.pet?.description || '',
            lost: data?.report?.report_type === 'lost',
            found: data?.report?.report_type === 'found',
        },
        validationSchema: formSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (user.id === data.report.user.id) {
                fetch('/petform', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values, null, 2),
                })
                .then(() => setMessage("Pet updated successfully"))
            }
            else setMessage('Unauthorized, please log in to continue')
        }
    });

    const handleChange = (e) => {
        setMessage('');
        formik.handleChange(e);
    };

    if (!data) return <div>Loading...</div>;

    return (
        <form onSubmit = {formik.handleSubmit}>
            <label>Name
                <input type='text' id='name' name='name' value={formik.values.name}
                    onChange={handleChange}/>
                <p style={{color:'red'}}>{formik.errors.name}</p>
            </label>
            <label>Breed
                <input type='text' id='breed' name='breed' value={formik.values.breed}
                    onChange={handleChange}/>
                <p style={{color:'red'}}>{formik.errors.breed}</p>
            </label>
            <label>Image
                <input type='text' id='image' name='image_url' value={formik.values.image_url}
                    onChange={handleChange}/>
                <p style={{color:'red'}}>{formik.errors.image_url}</p>
            </label>
            <label>Description
                <input type='text' id='description' name='description' value={formik.values.description}
                    onChange={handleChange}/>
                <p style={{color:'red'}}>{formik.errors.description}</p>
            </label>
            <label>Lost
                <input type='checkbox' id='lost' name='lost' checked={formik.values.lost}
                    onChange={handleChange}/>
                <p style={{color:'red'}}>{formik.errors.lost}</p>
            </label>
            <label>Found
                <input type='checkbox' id='found' name='found' checked={formik.values.found}
                    onChange={handleChange}/>
                <p style={{color:'red'}}>{formik.errors.found}</p>
            </label>
            {formik.errors['lost-or-found'] && (
                <p style={{ color: 'red' }}>{formik.errors['lost-or-found']}</p>
            )}
            <button type='submit'>Submit</button>
            <p>{message}</p>
        </form>
    );
};

export default PetUpdateForm