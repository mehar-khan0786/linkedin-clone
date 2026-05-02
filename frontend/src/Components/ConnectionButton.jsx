import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { authDataContext } from '../context/AuthContext'
import io from "socket.io-client";
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router';
const socket = io("https://linkedin-backend-e53y.onrender.com");

function ConnectionButton({userId}) {
    let {serverUrl}=useContext(authDataContext);
    let {userData,setUserData}=useContext(userDataContext);
    let [status,setStatus]=useState("Connect");
    let navigate=useNavigate();

    const handleSendConnection=async()=>{
        try{
            let result=await axios.post(`${serverUrl}/api/connection/send/${userId}`,{}, {withCredentials:true});
            console.log(result);
        }catch(err){
            console.log(err);
        }
    }

     const handleRemoveConnection=async()=>{
        try{
           let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,{ withCredentials:true });
            console.log(result);
             setStatus("Connect");

        }catch(err){
            console.log(err);
        }
    }

     const handleGetConnection=async()=>{
        try{
            let result=await axios.get(`${serverUrl}/api/connection/getStatus/${userId}`, {withCredentials:true});
            console.log(result);
            setStatus(result.data.status);
        }catch(err){
            console.log(err);
        }
    }

    
     const handleClick=async()=>{
       if(status==="disconnected"){
        await handleRemoveConnection();
       }else if(status=="received"){
        navigate("/network");
       }else{
        await handleSendConnection();
       }
    }

    useEffect(()=>{
        socket.emit("register",userData.user._id);
        handleGetConnection();

        socket.on("statusUpdate",({updatedUserId,newStatus})=>{
          if(updatedUserId.toString()===userId.toString()){
           setStatus(newStatus);
         }
        })
       

        return()=>{
            socket.off("statusUpdate");
        }

    }, [userId])


  return (
    <div>
        <button className='min-w-[100px] h-[40px] rounded-full border-2 border-blue-400 text-blue-500 cursor-pointer hover:bg-blue-400 hover:text-white px-4 py-1' onClick={handleClick} disabled={status=="pending"}>{status==="disconnected"?"Disconnected":status}</button>
    </div>
  )
}

export default ConnectionButton
