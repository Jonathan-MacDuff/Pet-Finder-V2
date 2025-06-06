import { Routes, Route, Navigate } from "react-router-dom";
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
          <Route path="/pets/new" element={<NewPetForm />} />
          <Route path="/pets/:id/sightings" element={<PetSightings />} />
          <Route path="/pets/:id" element={<SinglePet />} />
          <Route path="/pets/:id/edit" element={<PetUpdateForm />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/conversation/:otherId" element={<Conversation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
  );
};


export default App;
