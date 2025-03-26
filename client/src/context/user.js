import React, { useState, useEffect } from "react";

const UserContext = React.createContext();


function UserProvider({ children }) {
    const [user, setUser] = useState({});

    function checkSession() {
        fetch('/checksession')
        .then((r) => r.json())
        .then((data) => setUser(data))
    }

    useEffect(() => {
        checkSession()
      }, []);
    
    function addPet(newReport) {
        setUser(prevUser => ({
            ...prevUser,
            reports: [...prevUser.reports, newReport]
        }));
    };

    function updatePet(updatedReport) {
        const updatedReports = user.reports.map(report =>
            report.id === updatedReport.id ? updatedReport : report
        );
        setUser(prevUser => ({
            ...prevUser,
            reports: [...updatedReports]
        }));
    };

    function deletePet(id) {
        const updatedReports = user.reports.filter(report => report.pet.id !== Number(id));
        setUser(prevUser => ({
            ...prevUser,
            reports: [...updatedReports]
        }));
    };
    return <UserContext.Provider value={{ user, setUser, deletePet, addPet, updatePet, checkSession }}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };