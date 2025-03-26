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


function App() {
  return (
      <main>
        <NavBar/>
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
};


export default App;
