import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import PetList from "../pages/PetList";
import NewPetForm from "../pages/NewPetForm";
import Home from "../pages/Home";
import Signup from "../pages/Signup";

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path="/pets">
            <PetList />
          </Route>
          <Route path="/petform">
            <NewPetForm />
          </Route>
        </Switch>
      </main>
    </>
  )
}

export default App;
