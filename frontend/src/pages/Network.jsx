import React, { useContext, useEffect, useState } from "react";
import Nav from "../Components/Nav";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { FaCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";

import {io} from "socket.io-client";
export let socket=io("https://linkedin-backend-e53y.onrender.com");


function Network() {
  let { serverUrl } = useContext(authDataContext);
  let [connections, setConnections] = useState([]);

  const handleGetRequest = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true,
      });
      setConnections(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAcceptConnection = async (requestId) => {
    try {
      let result = await axios.put(
        `${serverUrl}/api/connection/accept/${requestId}`,
        {},
        { withCredentials: true },
      );

      console.log(result);
      setConnections(connections.filter((con)=>con._id!=requestId))
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejectConnection = async (requestId) => {
    try {
      let result = await axios.put(
        `${serverUrl}/api/connection/reject/${requestId}`,
        {},
        { withCredentials: true },
      );

      setConnections(connections.filter((con)=>con._id!=requestId))

    } catch (err) {
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    handleGetRequest();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-[#f3f2ef]">
      <Nav />

      <div className="pt-[90px] md:pt-[100px] flex justify-center px-3">
        <div className="w-[95%] md:w-[700px] bg-white rounded-xl shadow-md p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-semibold mb-6">
            Invitations ({connections.length})
          </h1>

          {connections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending invitations
            </p>
          ) : (
            connections.map((connection) => (
              <div
                key={connection._id}
                className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b py-5 hover:bg-gray-50 px-3 rounded-lg transition"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <img
                    src={
                      connection.sender.profileImage ||
                      "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                    }
                    alt=""
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border"
                  />

                  <div>
                    <h2 className="font-semibold text-base md:text-lg">
                      {connection.sender.firstName} {connection.sender.lastName}
                    </h2>

                    <p className="text-gray-600 text-xs md:text-sm">
                      {connection.sender.headline}
                    </p>
                  </div>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                  <button
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => handleRejectConnection(connection._id)}
                  >
                    <ImCross className="text-sm" />
                    Ignore
                  </button>

                  <button
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={() => handleAcceptConnection(connection._id)}
                  >
                    <FaCheckCircle className="text-sm" />
                    Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Network;
