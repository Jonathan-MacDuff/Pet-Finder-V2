import React from "react";
import { Link } from "react-router-dom";

function NavBar() {

    function handleSignout() {
        fetch('/signout', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(),
        })
      };
    
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/signin">Sign In</Link>           
            <Link to="/pets">Pets</Link>
            <Link to="/petform">New Pet</Link>
            <Link to="/messages">Messages</Link>
            <button onClick={handleSignout}>Signout</button> 
        </nav>
    );
};


export default NavBar;
