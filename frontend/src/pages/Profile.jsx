import React, { useContext, useEffect, useState } from "react";
import Nav from "../Components/Nav";
import { userDataContext } from "../context/UserContext";
import { HiPencil } from "react-icons/hi2";
import EditProfile from "../Components/EditProfile";
import Post from "../Components/Post.jsx";
import ConnectionButton from "../Components/ConnectionButton.jsx";

function Profile() {
  const { userData, edit, setEdit, postData, profileData } =
    useContext(userDataContext);

  const [profilePost, setProfilePost] = useState([]);

  const profileUser = profileData?.user;
  const loggedInUser = userData?.user;

  // ✅ check own profile
  const isOwnProfile = profileUser?._id === loggedInUser?._id;

  // ✅ filter posts
  useEffect(() => {
    if (postData && profileUser?._id) {
      const filtered = postData.filter(
        (post) => post.author._id === profileUser._id
      );
      setProfilePost(filtered);
    }
    
  }, [postData, profileUser]);

  // ✅ loading
  if (!profileUser) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Nav />
      {edit && <EditProfile />}

      <div className="pt-[90px] flex justify-center px-3 md:px-6">
        <div className="w-full max-w-5xl grid md:grid-cols-3 gap-5">

          {/* ================= MAIN ================= */}
          <div className="md:col-span-2 space-y-5">

            {/* ===== PROFILE CARD ===== */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="h-52 bg-gray-300">
                <img
                  src={profileUser.coverImage || "https://via.placeholder.com/1200x300"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 relative">
                <img
                  src={profileUser.profileImage || "https://via.placeholder.com/150"}
                  className="w-36 h-36 rounded-full border-4 border-white -mt-20 object-cover"
                />

                <div className="mt-4">
                  <h1 className="text-3xl font-bold">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>

                  <p className="text-lg text-gray-700 mt-2">
                    {profileUser.headline || "No headline"}
                  </p>

                  <p className="text-gray-500 mt-2">
                    {profileUser.location || "No location"}
                  </p>

                  <p className="text-blue-600 font-medium mt-2">
                    {profileUser.connection?.length || 0} Connections
                  </p>
                  

                  {/* ✅ TOP BUTTON */}
                  <div className="mt-5">
                    {isOwnProfile ? (
                      <button
                        className="border border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-white transition"
                        onClick={() => setEdit(true)}
                      >
                        Edit Profile <HiPencil />
                      </button>
                    ) : (
                      <ConnectionButton userId={profileUser._id} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== POSTS ===== */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="text-xl font-semibold mb-4">
                {`Posts (${profilePost?.length || 0})`}
              </div>
            </div>

            {profilePost.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.author}
                like={post.like}
                comment={post.comment}
                description={post.description}
                image={post.image}
                createdAt={post.createdAt}
              />
            ))}

            {/* ===== ABOUT ===== */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Headline</h2>
              <p className="text-gray-700">
                {profileUser.headline || "No headline available"}
              </p>

              {isOwnProfile && (
                <button
                  className="border mt-4 border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:bg-blue-500 hover:text-white"
                  onClick={() => setEdit(true)}
                >
                  Edit About
                </button>
              )}
            </div>

            {/* ===== SKILLS ===== */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Skills</h2>

              {profileUser.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profileUser.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-200 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added</p>
              )}

              {isOwnProfile && (
                <button
                  className="border mt-4 border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:bg-blue-500 hover:text-white"
                  onClick={() => setEdit(true)}
                >
                  Edit Skills
                </button>
              )}
            </div>

            {/* ===== EXPERIENCE ===== */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Experience</h2>

              {profileUser.experience?.length > 0 ? (
                profileUser.experience.map((exp, index) => (
                  <div key={index} className="border-b pb-5 mb-5">
                    <p><b>Title:</b> {exp.title}</p>
                    <p><b>Company:</b> {exp.company}</p>
                    <p><b>Description:</b> {exp.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No experience added</p>
              )}

              {isOwnProfile && (
                <button
                  className="border mt-4 border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:bg-blue-500 hover:text-white"
                  onClick={() => setEdit(true)}
                >
                  Edit Experience
                </button>
              )}
            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="space-y-5">

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
              <p className="text-gray-600">{profileUser.email}</p>
            </div>

            {/* Education */}
            {profileUser.education?.length > 0 ? (
              profileUser.education.map((edu, index) => (
                <div key={edu._id || index} className="bg-white rounded-2xl shadow p-6">
                  <p><b>College:</b> {edu.college}</p>
                  <p><b>Degree:</b> {edu.degree}</p>
                  <p><b>Field:</b> {edu.fieldOfStudy}</p>

                  {isOwnProfile && (
                    <button
                      className="border mt-4 border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:bg-blue-500 hover:text-white"
                      onClick={() => setEdit(true)}
                    >
                      Edit Education
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow p-6 text-gray-500">
                No education added
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;