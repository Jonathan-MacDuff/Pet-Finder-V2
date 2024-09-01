import {React, useState, useEffect} from "react";

function Signup() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function handleSubmit(e) {
        e.preventDefault();
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
    };

    return (
        <form onSubmit = {handleSubmit}>
            <label>Username
                <input type='text' id='username' value={username}
                    onChange={(e) => setUsername(e.target.value)}/>
            </label>
            <label>Password
                <input type='text' id='password' value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <button type='submit'></button>
        </form>
    );
};

export default Signup