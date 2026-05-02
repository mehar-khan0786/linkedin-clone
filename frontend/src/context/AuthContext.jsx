import React, { createContext } from 'react'

export const authDataContext=createContext();
const serverUrl="https://linkedin-backend-e53y.onrender.com";
let value ={
serverUrl
}

function AuthContext({children}) {
  return (
    <div>
        <authDataContext.Provider value={value}>
             {children}
        </authDataContext.Provider>
    </div>
  )
}

export default AuthContext
