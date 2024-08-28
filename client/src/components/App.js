import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import PetList from "../pages/PetList";

function App() {
  return (
    <>
    <NavBar/>
    <main>
      <Switch>
        <Route path="/pets">
          <PetList/>
        </Route>
      </Switch>
    </main>
    </>
  )
}

export default App;
