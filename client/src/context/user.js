import React, { useState } from "react";

const UserContext = React.createContext();


function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    
    // function addPet() {

    // }

    // function updatePet() {

    // }

    function deletePet(id) {
        const updatedReports = user.reports.filter(report => report.pet.id !== Number(id));
        setUser(prevUser => ({
            ...prevUser,
            reports: [...updatedReports]
        }));
    };
    return <UserContext.Provider value={{ user, setUser, deletePet }}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };