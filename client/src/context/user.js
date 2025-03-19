import React, { useState } from "react";

const UserContext = React.createContext();


function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    
    function addPet(newReport) {
        setUser(prevUser => ({
            ...prevUser,
            reports: [...prevUser.reports, newReport]
        }))
    }

    // function updatePet() {

    // }

    function deletePet(id) {
        const updatedReports = user.reports.filter(report => report.pet.id !== Number(id));
        setUser(prevUser => ({
            ...prevUser,
            reports: [...updatedReports]
        }));
    };
    return <UserContext.Provider value={{ user, setUser, deletePet, addPet }}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };