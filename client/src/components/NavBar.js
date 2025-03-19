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
            <Link to="/" style={{margin: "3px"}}>Home</Link>
            <Link to="/signup" style={{margin: "3px"}}>Sign Up</Link>
            <Link to="/signin" style={{margin: "3px"}}>Sign In</Link>
            <Link to="/mypets" style={{margin: "3px"}}>My Pets</Link>
            <Link to="/pets" style={{margin: "3px"}}>All Pets</Link>
            <Link to="/petform" style={{margin: "3px"}}>New Pet</Link>
            <Link to="/messages" style={{margin: "3px"}}>Messages</Link>
            <button onClick={handleSignout}>Signout</button> 
        </nav>
    );
};


export default NavBar;
