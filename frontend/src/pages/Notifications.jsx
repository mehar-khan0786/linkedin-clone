import React, { useEffect, useState, useContext } from "react";
import Nav from "../Components/Nav";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import moment from "moment";
import { RxCrossCircled } from "react-icons/rx";

function Notifications() {
  const { serverUrl } = useContext(authDataContext);
  const { handleGetProfile } = useContext(userDataContext);

  const [notifications, setNotifications] = useState([]);

  const getNotification = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/notification/get`, {
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/notification/deleteOne/${id}`, {
        withCredentials: true,
      });

      // remove from UI instantly
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAllNotification = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/notification`, {
        withCredentials: true,
      });
      setNotifications([]);

    } catch (err) {
      console.log(err);
    }
  };

  function handleMessage(type) {
    if (type === "like") return "liked your post";
    if (type === "comment") return "commented on your post";
    if (type === "connection") return "sent you a connection request";
    return "interacted with you";
  }

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Nav />

      <div className="pt-[100px] flex justify-center px-4">
        <div className="w-full max-w-3xl bg-white shadow rounded-xl p-5">
          {/* ===== TITLE ===== */}
          <h2 className="text-xl font-semibold mb-4">
            Notifications ({notifications.length})
          </h2>
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAllNotification}
              className="text-sm px-3 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white"
            >
              Clear All
            </button>
          )}
          {/* ===== LIST ===== */}
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <div
                key={noti._id}
                className="relative flex items-start gap-3 p-3 border-b hover:bg-gray-100 rounded cursor-pointer overflow-auto"
                onClick={() => handleGetProfile(noti.relatedUser?.userName)}
              >
                <RxCrossCircled
                  className="absolute top-2 right-2 w-7 h-7 text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent profile open
                    handleDeleteNotification(noti._id);
                  }}
                />

                {/* USER IMAGE */}
                <img
                  src={
                    noti.relatedUser?.profileImage ||
                    `https://ui-avatars.com/api/?name=${
                      noti.relatedUser?.firstName || "User"
                    }`
                  }
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* CONTENT */}
                <div className="flex flex-col w-full">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {noti.relatedUser?.firstName} {noti.relatedUser?.lastName}
                    </span>{" "}
                    {handleMessage(noti.type)}
                  </p>

                  {/* POST PREVIEW */}
                  {noti.relatedPost && (
                    <div className="flex gap-2 mt-2 items-center">
                      {noti.relatedPost.image && (
                        <img
                          src={noti.relatedPost.image}
                          className="w-[80px] h-[60px] object-cover rounded"
                        />
                      )}

                      <p className="text-sm text-gray-600">
                        {noti.relatedPost.description}
                      </p>
                    </div>
                  )}

                  {/* TIME */}
                  <div className="text-xs text-gray-400 mt-1">
                    {moment(noti.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No notifications yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
