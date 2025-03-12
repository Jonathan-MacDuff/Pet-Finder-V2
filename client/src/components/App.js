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
import Messages from "../pages/Messages";
import Conversation from "./Conversation";
import MyPets from "../pages/MyPets";
import { useEffect, useContext } from "react";
import { UserProvider, UserContext } from "../context/user";

function App() {
  return (
    <UserProvider>
      <NavBar/>
      <MainContent/>
    </UserProvider>
  );
}

function MainContent() {
  const {setUser} = useContext(UserContext)

  useEffect(() => {
    fetch('/checksession')
    .then((r) => r.json())
    .then((data) => setUser(data))
  }, [setUser]);



  return (
    <>
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
          <Route path='/mypets'>
            <MyPets />
          </Route>
          <Route path="/pets">
            <PetList />
          </Route>
          <Route path="/petform">
            <NewPetForm />
          </Route>
          <Route path='/sighting/:id'>
            <PetSightings />
          </Route>
          <Route path="/singlepet/:id">
            <SinglePet/>
          </Route>
          <Route path='/petupdate/:id'>
            <PetUpdateForm/>
          </Route>
          <Route path='/messages'>
            <Messages/>
          </Route>
          <Route path='/conversation/:otherId'>
            <Conversation/>
          </Route>
        </Switch>
      </main>
    </>
  )
}


export default App;
