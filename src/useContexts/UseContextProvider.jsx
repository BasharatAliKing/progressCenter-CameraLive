import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
const UseContextProvider = ({children}) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("user"));
    const [searchMain, setSearchMain] = useState("");
   const authorizationtoken = `Bearer ${token}`;
    const [cameras, setCameras] = useState([]);
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/camera");
        const data = await res.json();
        setCameras(data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      } 
    };
    fetchCameras();
  }, []);
  const storetokeninLS = (servertoken) => {
    setToken(servertoken);
    return localStorage.setItem("token", servertoken);
  };
  const storedatainuser = (userdata) => {
    setUser(userdata);
    return localStorage.setItem("user",userdata);
  };
  // const userAuthentication = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/login-user-dashboard/`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     if (response.ok) {
  //       setUser(data);
  //     }
  //   } catch (err) {
  //     console.log("Error fetching user data");
  //   }
  // };
   const LogoutUser = () => {
    setToken("");
    setUser("");
    return localStorage.removeItem("token");
  };
   useEffect(() => {
    // userAuthentication();
  }, []);
  return (
   <UserContext.Provider
      value={{
        storetokeninLS,
        user,
        token,
        authorizationtoken,
        searchMain,
        setSearchMain,
        LogoutUser,
        storedatainuser,
        cameras,
      }}>
         {children}
      </UserContext.Provider>
  )
};

export default UseContextProvider;
