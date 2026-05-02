import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { authDataContext } from './context/AuthContext'
import { userDataContext } from './context/UserContext'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notifications';


function App() {

  const { serverUrl } = useContext(authDataContext); 
   let {userData}=useContext(userDataContext);
  return (
   
    <Routes>
      <Route path="/" element={userData?<Home />:<Navigate to="/login" />} />
      <Route path="/login" element={userData?<Navigate to="/" />:<Login />} />
      <Route path="/signup" element={userData?<Navigate to="/" />:<Signup />} />
      <Route path="/network" element={userData?<Network/>:<Navigate to="/login" />} />
      <Route path="/profile" element={userData?<Profile/>:<Navigate to="/login" />} />
      <Route path="/notification" element={userData?<Notification/>:<Navigate to="/login" />} />


    </Routes>
  )
}

export default App