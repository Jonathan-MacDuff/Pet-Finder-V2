import { Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import PetList from "../pages/PetList";
import NewPetForm from "../pages/NewPetForm";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import PetUpdateForm from "./PetUpdateForm";
import SinglePet from "./SinglePet";
import PetSightings from "./PetSightings";
import { useEffect, useState } from "react";

function App() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/checksession')
    .then((r) => r.json())
    .then((data) => setUser(data))
  }, []);


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
          <Route path='/signin'>
            <Signin />
          </Route>
          <Route path="/pets">
            <PetList />
          </Route>
          <Route path="/petform">
            <NewPetForm />
          </Route>
          <Route path="/singlepet/:id">
            <SinglePet user={user}/>
          </Route>
          <Route path='/petupdate/:id'>
            <PetUpdateForm user={user}/>
          </Route>
          <Route path='/sighting/:id'>
            <PetSightings />
          </Route>
        </Switch>
      </main>
    </>
  )
}

export default App;
