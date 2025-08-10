import { React, useContext } from "react";
import {  useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/user";
import { BACKEND_URL } from '../config';

function NavBar() {

    const {user, setUser, checkSession } = useContext(UserContext);
    const navigate = useNavigate();

    function handleSignout() {
        fetch(`${BACKEND_URL}/signout`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(),
        })
        .then((r) => r.json())
        .then((data) => {
            setUser(data)
            checkSession()
            navigate('/')
        });
      };

      function handleSignUp() {
        navigate("/signup");
    };

    function handleSignIn() {
        navigate("/signin");
    };
    
    if (user.message)
    
        return (
            <nav>
                <Link to="/" style={{margin: "3px"}}>Home</Link>
                <Link to="/pets" style={{margin: "3px"}}>All Pets</Link>
                <button onClick={handleSignUp} style={{margin: "3px"}}>Sign Up</button>
                <button onClick={handleSignIn} style={{margin: "3px"}}>Sign In</button>
            </nav>
        );
    
    else

        return (
            <nav>
                <Link to="/" style={{margin: "3px"}}>Home</Link>
                <Link to="/mypets" style={{margin: "3px"}}>My Pets</Link>
                <Link to="/pets" style={{margin: "3px"}}>All Pets</Link>
                <Link to="/pets/new" style={{margin: "3px"}}>New Pet</Link>
                <Link to="/messages" style={{margin: "3px"}}>Messages</Link>
                <button onClick={handleSignout}>Signout</button> 
            </nav>
        );
};


export default NavBar;
