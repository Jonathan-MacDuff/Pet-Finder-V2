import { Routes, Route } from "react-router-dom";
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
};

function MainContent() {
  const {setUser} = useContext(UserContext)

  useEffect(() => {
    fetch('/checksession')
    .then((r) => r.json())
    .then((data) => setUser(data))
  }, [setUser]);



  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/mypets" element={<MyPets />} />
        <Route path="/pets" element={<PetList />} />
        <Route path="/petform" element={<NewPetForm />} />
        <Route path="/sighting/:id" element={<PetSightings />} />
        <Route path="/singlepet/:id" element={<SinglePet />} />
        <Route path="/petupdate/:id" element={<PetUpdateForm />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/conversation/:otherId" element={<Conversation />} />
      </Routes>
    </main>
  );
}


export default App;
