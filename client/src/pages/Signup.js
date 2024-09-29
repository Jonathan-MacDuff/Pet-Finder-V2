import {React} from "react";
import { useFormik } from "formik";

function Signup() {

    const formik = useFormik({
        initialValues: {
        username: '',
        password: '',
        },
        // validate,
        onSubmit: (values) => {
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values, null, 2),
            }).then((r) => r.json()) 
        },
    })

    // const [username, setUsername] = useState('')
    // const [password, setPassword] = useState('')


    return (
        <form onSubmit = {formik.handleSubmit}>
            <label>Username
                <input type='text' id='username' name='username' value={formik.values.username}
                    onChange={formik.handleChange}/>
            </label>
            <label>Password
                <input type='text' id='password' name='password' value={formik.values.password}
                    onChange={formik.handleChange}/>
            </label>
            <button type='submit'>Submit</button>
        </form>
    );
};

export default Signup