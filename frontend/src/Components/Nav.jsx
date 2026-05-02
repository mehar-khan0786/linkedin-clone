import React, { useContext, useEffect, useState } from "react";
import logo2 from "../assets/logo2.png";
import { FaSearch, FaHome } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Nav() {
  const { userData, setUserData, handleGetProfile } =
    useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);

  const handleSignOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${searchInput}`,
        { withCredentials: true }
      );
      setSearchData(result.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchInput) {
        handleSearch();
      } else {
        setSearchData([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput]);

  return (
    <div className="w-full h-[70px] bg-white fixed shadow flex justify-between items-center px-4 md:px-10 z-50">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-2 md:gap-4 relative">
        <img
          src={logo2}
          alt="Logo"
          className="w-10 h-10 md:w-12 md:h-12 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* ===== SEARCH ===== */}
        <form
          className="flex items-center bg-gray-100 px-3 py-1 rounded-full focus-within:ring-2 focus-within:ring-blue-500"
          onSubmit={(e) => e.preventDefault()}
        >
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none ml-2 w-[120px] sm:w-[200px] md:w-[300px] h-[35px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {/* ===== SEARCH DROPDOWN ===== */}
        {searchInput && (
          <div className="absolute top-[70px] left-0 w-full lg:w-[400px] bg-white shadow-lg rounded-lg p-4 z-50 max-h-[300px] overflow-y-auto">
            
            {searchData.length > 0 ? (
              searchData.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 border-b p-[10px] border-gray-400 cursor-pointer rounded hover:bg-gray-200 rounded-lg cursor-pointer"
                  onClick={() => {
                    handleGetProfile(user.userName);
                    setSearchInput("");
                    setSearchData([]);
                  }}
                >
                  <img
                    src={
                      user.profileImage ||"https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.headline || "No headline"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found</p>
            )}
          </div>
        )}
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4 md:gap-8 relative">

        {/* ===== POPUP ===== */}
        {showPopup && (
          <div className="w-[300px] min-h-[250px] bg-white shadow-lg absolute top-[75px] right-0 rounded-lg flex flex-col items-center gap-4 p-4">

            <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
              <img
                src={
                  userData?.user?.profileImage ||
                  "https://via.placeholder.com/100"
                }
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-lg font-semibold text-gray-700">
              {userData?.user?.firstName} {userData?.user?.lastName}
            </div>

            <button
              className="border border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:bg-blue-500 hover:text-white transition"
              onClick={() =>
                handleGetProfile(userData?.user?.userName)
              }
            >
              View Profile
            </button>

            <div className="w-full h-[1px] bg-gray-300"></div>

            <div
              className="flex w-full items-center gap-2 cursor-pointer"
              onClick={() => navigate("/network")}
            >
              <IoPeopleSharp className="text-xl" />
              <span>My Network</span>
            </div>

            <button
              className="border border-red-500 text-red-500 py-2 px-4 w-full rounded-full hover:bg-red-500 hover:text-white transition"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        {/* ===== NAV ITEMS ===== */}
        <div
          className="hidden md:flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <FaHome className="text-xl md:text-2xl" />
          <span className="hidden lg:block text-sm">Home</span>
        </div>

        <div
          className="hidden md:flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/network")}
        >
          <IoPeopleSharp className="text-xl md:text-2xl" />
          <span className="hidden lg:block text-sm">My Network</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <IoIosNotifications className="text-xl cursor-pointer md:text-2xl" />
          <span className="hidden lg:block text-sm" onClick={() => navigate("/notification")}>
            Notifications
          </span>
        </div>

        {/* ===== PROFILE IMAGE ===== */}
        <div
          className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer hover:border-2 border-blue-400"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          <img
            src={
              userData?.user?.profileImage ||
              "https://via.placeholder.com/100"
            }
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;