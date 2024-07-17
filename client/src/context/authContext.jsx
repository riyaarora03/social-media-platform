import { createContext,useEffect,useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [currentUser, setCurrentUser]=useState(JSON.parse(localStorage.getItem("user")) || null
    );
    const [modalOpen,setModalOpen]=useState(false);

    const login = async (inputs)=>{
        const res = await axios.post("http://localhost:8800/api/auth/login",inputs, {
            withCredentials: true,
        });
        setCurrentUser(res.data)
    };

    // const logout=()=>{
    //     setCurrentUser(null);
    //     localStorage.removeItem("user");
    // };

    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(currentUser));
    },[currentUser]);

    return(
        <AuthContext.Provider value={{currentUser,login,setModalOpen,modalOpen}}>{children}</AuthContext.Provider>
    );
};