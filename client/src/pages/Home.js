import { React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";

function Home() {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    if (user.message) {
        return(
            <div>
                <h1>Welcome to Pet Finder!</h1>
                <h2>Please sign in or create an account.</h2>
                <button onClick={() => navigate('/signin')}>Sign In</button>
                <button onClick={() => navigate('/signup')}>Create Account</button>
            </div>
        );
    }

    else {
        return(
            <div>
                <h1>Welcome to Pet Finder, {user.username}!</h1>
                <h2>Please use the navigation bar above to browse the site.</h2>
            </div>
        )
    }
};

export default Home