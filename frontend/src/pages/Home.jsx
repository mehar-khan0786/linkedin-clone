import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../Components/Nav.jsx";
import { IoCameraOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { userDataContext } from "../context/UserContext.jsx";
import { HiPencil } from "react-icons/hi2";
import EditProfile from "../Components/EditProfile.jsx";
import { RxCrossCircled } from "react-icons/rx";
import { FaBullseye, FaImage, FaS } from "react-icons/fa6";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import Post from "../Components/Post.jsx";

function Home() {
  let { userData, edit, setEdit, postData, setPostData ,handleGetProfile} =
    useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [uploadPost, setUploadPost] = useState(false);
  let [posting, setPosting] = useState(false);
  let [suggestedUser, setSuggestedUser] = useState([]);
  let image = useRef();

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);

    setFrontendImage(URL.createObjectURL(file));
  }

  async function handlUploadPost() {
    try {
      setPosting(true);
      let formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) {
        formdata.append("image", backendImage);
      }
      let result = await axios.post(serverUrl + "/api/post/create", formdata, {
        withCredentials: true,
      });
      console.log(result);
      setPosting(false);
      setUploadPost(false);
    } catch (err) {
      setPosting(false);
      console.log(err);
    }
  }

  const handlSuggestedUser = async (userName) => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggestedusers", {
        withCredentials: true,
      });
      console.log(result.data);
      setSuggestedUser(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handlSuggestedUser();
  }, []);

  return (
    <div className="w-full min-h-[100vh] bg-[#f3f2ef]">
      {edit && <EditProfile />}
      <Nav />

      {/* MAIN CONTAINER */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-5 px-3 sm:px-6 lg:px-10 pt-[100px] pb-[50px]">
        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-[25%] bg-white shadow-md rounded-xl p-4 relative">
          {/* COVER IMAGE */}
          <div
            className="w-full h-[120px] rounded-lg bg-gray-300 overflow-hidden cursor-pointer relative"
            onClick={() => setEdit(true)}
          >
            <img
              src={
                userData?.user?.coverImage ||
                "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=600&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              }
              className="w-full h-full object-cover"
              alt="cover"
            />
            <IoCameraOutline className="absolute right-3 top-3 w-6 h-6 text-white" />
          </div>

          {/* PROFILE IMAGE */}
          <div
            className="w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[95px] left-[27px] border-2 border-white cursor-pointer"
            onClick={() => setEdit(true)}
          >
            <img
              src={
                userData?.user?.profileImage ||
                "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-[22px] h-[22px] bg-blue-500 absolute top-[130px] left-[78px] rounded-full flex justify-center items-center cursor-pointer">
            <IoMdAdd className="text-white text-sm" />
          </div>

          <div className="mt-[24px] pl-2">
            <div className="text-[20px] font-semibold text-gray-800">
              {userData?.user?.firstName} {userData?.user?.lastName}
            </div>
            <div className="text-[15px] text-gray-600">
              {userData?.user?.headline || "No headline"}
            </div>
            <div className="text-[14px] text-gray-500">
              {userData?.user?.location || "Location"}
            </div>
          </div>

          <button
            className="border mt-4 border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition"
            onClick={() => setEdit(true)}
          >
            Edit Profile <HiPencil />
          </button>
        </div>

        {/* whats on your mind box */}

        {uploadPost && (
          <>
            {/* BACKGROUND OVERLAY */}
            <div className="w-full fixed h-full fixed bg-black top-0 left-0 opacity-[0.6] z-[100]"></div>

            {/* MODAL */}
            <div className="w-[90%] max-w-[400px] h-[500px] md:h-[560px] bg-white shadow-lg rounded-lg fixed z-[200] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-[20px] flex flex-col gap-[20px]">
              {/* CLOSE BUTTON */}
              <div className="top-[20px] right-[20px] absolute cursor-pointer">
                <RxCrossCircled
                  onClick={() => setUploadPost(false)}
                  className="w-[25px] h-[25px] text-gray-900"
                />
              </div>

              {/* USER INFO */}
              <div className="flex items-center gap-[10px]">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                  <img
                    src={
                      userData?.user?.profileImage ||
                      "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-[18px] font-semibold text-gray-800">
                  {userData?.user?.firstName} {userData?.user?.lastName}
                </div>
              </div>

              {/* TEXTAREA */}
              <textarea
                value={description}
                className={`w-full ${frontendImage ? "h-[200px]" : "h-[300px]"} outline-none p-[10px] resize-none text-[18px]`}
                placeholder="What do you want to talk about?"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              {/* IMAGE INPUT */}
              <input type="file" ref={image} hidden onChange={handleImage} />

              {/* IMAGE PREVIEW */}
              {frontendImage && (
                <div className="w-full h-[200px] flex justify-center items-center overflow-hidden rounded-lg">
                  <img
                    src={frontendImage}
                    alt=""
                    className="h-full object-cove rounded-lg"
                  />
                </div>
              )}

              {/* ACTIONS */}
              <div className="w-full flex flex-col">
                <div className="p-[10px] border-t flex items-center">
                  <FaImage
                    className="w-[24px] h-[24px] text-gray-500 cursor-pointer"
                    onClick={() => image.current.click()}
                  />
                </div>

                {/* POST BUTTON RIGHT */}
                <div className="flex justify-end mt-3">
                  <button
                    className="px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 text-white"
                    disabled={posting}
                    onClick={handlUploadPost}
                  >
                    {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="w-full lg:w-[50%] min-h-[200px] flex flex-col gap-[20px]">
          <div className="w-full h-[100px] flex justify-center  items-center gap-[10px] bg-white shadow-lg rounded-lg">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden top-[95px] left-[27px] border-2 border-white cursor-pointer">
              <img
                src={
                  userData?.user?.profileImage ||
                  "https://via.placeholder.com/150"
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              className="w-[80%] h-[50px] border-2 border-gray-500 rounded-full flex items-start justify-start p-[10px] hover:bg-gray-200 cursor-pointer"
              onClick={() => setUploadPost(true)}
            >
              Start a Post
            </button>
          </div>

          {postData?.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              description={post.description}
              author={post.author}
              image={post.image}
              like={post.like}
              comment={post.comment}
              createdAt={post.createdAt}
            />
          ))}
        </div>

        <div className="hidden lg:flex flex-col w-full lg:w-[25%] bg-white shadow-md rounded-xl p-5 gap-3">
          <h2 className="font-bold text-lg">Suggestions</h2>

          {suggestedUser?.length > 0 ? (
            suggestedUser.map((user) => (
              <div
                key={user._id}
                className="flex rounded-xl hover:bg-gray-200 cursor-pointer items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleGetProfile(user.userName)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profileImage || "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.headline || "No headline"}
                    </p>
                  </div>
                </div>

               
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-3">
              No suggestions available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
