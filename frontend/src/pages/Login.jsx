import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userDataContext } from '../context/UserContext';

function Login() {
  let [show, setShow] = useState(true)
  let navigate = useNavigate();
  let {userData,setUserData}=useContext(userDataContext)


  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading,setLoading]=useState(false);
  let [error,setErr]=useState(null);

  const server = "http://localhost:8000/";
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
     if (!email || !password) {
      setLoading(false);
    alert("All fields required");
    
    return;
  }


    try {
      let result = await axios.post(
        server + "api/auth/login",
        {email, password },
        { withCredentials: true }
      );

      setUserData(result.data);
      navigate("/");
      setLoading(false);
      setEmail("");
      setPassword("");
      setErr("");
      

    } catch (err) {
      setErr(err.response?.data?.message);
      setLoading(false);
    }

  };

  return (
    <div className="w-full h-screen bg-white relative">

      <div className="absolute top-5 left-5">
        <img 
          src="https://th.bing.com/th/id/OIP.SL2Gf-U_ixigPGDa-r4JQwHaHa?w=174&h=180" 
          alt="logo" 
          className="h-10" 
        />
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <form onSubmit={handleSignIn} className="w-[90%] max-w-[400px] shadow-2xl p-6 flex flex-col gap-4">

          <h2 className="text-2xl font-bold text-center">Sign In</h2>

          <input value={email} type="email" placeholder="Email"
            className="border p-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

           
          <div className='w-full relative border p-2 rounded'>
            
            <input value={password}
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span 
              className='absolute text-blue-700 right-2 top-2 cursor-pointer'
              onClick={() => setShow(prev => !prev)}
            >
              {show ? "hide" : "show"}
            </span>
            
          </div>
          {error && <p className='text-center text-red-500 text-sm'>
             *{error}</p>}

          <button 
            type="submit" 
            className="mt-4 bg-blue-600 rounded-full hover:bg-blue-700 text-white p-2" disabled={loading}
          >
           {loading ? "Loading..." : "Sign In"}
          </button>

          <p className='text-center mb-10 cursor-pointer' onClick={() => navigate("/signup")}>
            Want to create a new account ? 
            <span className='text-blue-600'>
              Sign up
            </span>
          </p>

        </form>
      </div>

    </div>
  )
}

export default Login