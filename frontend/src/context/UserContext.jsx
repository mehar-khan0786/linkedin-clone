import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";

import {io} from "socket.io-client";
export let socket=io("http://localhost:8000");


export const userDataContext = createContext();

function UserContext({ children }) {
  let [userData, setUserData] = useState(null);
  let { serverUrl } = useContext(authDataContext);
  let [edit, setEdit] = useState(false);
  let [postData, setPostData] = useState();
  let [profileData, setProfileData] = useState(null);
  let navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentUser", {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result);
    } catch (err) {
      console.log(err);
      setUserData(null);
    }
  };

  const getPost = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true,
      });
      console.log(result);
      setPostData(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(
        serverUrl + `/api/user/profile/${userName}`,
        { withCredentials: true },
      );
      setProfileData(result.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getPost();
  }, []);

  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    profileData,
    setProfileData,
    handleGetProfile,
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
