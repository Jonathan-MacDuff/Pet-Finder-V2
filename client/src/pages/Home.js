import { React, useContext } from "react";
import { UserContext } from "../context/user";

function Home() {
    const {user} = useContext(UserContext);

    if (user.message) {
        return(
            <div>
                <h1>Welcome to Pet Finder!</h1>
                <h2>Please sign up or sign in.</h2>
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