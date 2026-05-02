import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { useState } from "react";
import { useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { userDataContext } from "../context/UserContext";
import { IoCameraOutline } from "react-icons/io5";
import { useRef } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

function EditProfile() {
  let {serverUrl}=useContext(authDataContext);
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  let [firstName, setFirstName] = useState(userData?.user?.firstName || "");
  let [lastName, setLastName] = useState(userData?.user?.lastName || "");
  let [userName, setUserName] = useState(userData?.user?.userName || "");
  let [headline, setHeadline] = useState(userData?.user?.headline || "");
  let [location, setLocation] = useState(userData?.user?.location || "");
  let [gender, setGender] = useState(userData?.user?.gender || "");
  let [skills, setSkills] = useState(userData?.user?.skills || []);
  let [experience, setExperience] = useState(userData?.user?.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData?.user?.education || []);
  let [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });

  let [frontendProfileImage, setFrontendProfileImage] = useState(
    userData?.user?.profileImage ||
      "https://th.bing.com/th/id/OIP.ru0wrXfTeNNoZn4xsBV72QHaHa",
  );
  let [backendProfileImage, setBackendProfileImage] = useState(null);

  let [frontendCoverImage, setFrontendCoverImage] = useState(
    userData?.user?.coverImage || "",
  );
  let [backendCoverImage, setBackendCoverImage] = useState(null);
  let [saving,setSaving]=useState(false);

  const profileImage = useRef();
  const coverImage = useRef();

  function addSkill(e) {
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      let updatedSkills = skills.filter((s) => s !== skill);
      setSkills(updatedSkills);
    }
  }

  function addEducation() {
    if (
      newEducation.college &&
      newEducation.degree &&
      newEducation.fieldOfStudy
    ) {
      setEducation([...education, newEducation]);
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: "",
    });
  }

  function removeEducation(educationItem) {
    if (education.includes(educationItem)) {
      const updatedEducation = education.filter((edu) => edu != educationItem);
      setEducation(updatedEducation);
    }
  }

  function addExperience() {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description
    ) {
      setExperience([...experience, newExperience]);
    }
    setNewExperience({
      title: "",
      company: "",
      description: "",
    });
  }

  function removeExperience(experienceItem) {
    if (experience.includes(experienceItem)) {
      const updatedExperience = experience.filter(
        (exp) => exp != experienceItem,
      );
      setExperience(updatedExperience);
    }
  }

  function handleProfileImage(e) {
    const file = e.target.files[0];
    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
    console.log("Selected profile image:", file);
  }

  function handleCoverImage(e) {
    const file = e.target.files[0];
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));
      
      if(backendProfileImage){
        formdata.append("profileImage",backendProfileImage);
      }

      if(backendCoverImage){
        formdata.append("coverImage",backendCoverImage);
      }

      console.log("Profile before send:", backendProfileImage);
      let result=await axios.put(serverUrl+"/api/user/updateProfile",formdata,{
        withCredentials:true
      });
      setUserData(result.data);
      console.log(result);
      setSaving(false);
      setEdit(false);
    } catch (err) {
      console.log(err);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImage}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImage}
      />

      <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>

      <div className="w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] rounded-lg p-[10px] overflow-auto">
        <div
          className="top-[20px]  right-[20px] text-gray-900 font-semibold absolute cursor-pointer"
          onClick={() => setEdit(false)}
        >
          <RxCrossCircled className="w-[25px] h-[25px] font-semibold text-gray-900 " />
        </div>

        <div
          className="w-full h-[150px] bg-gray-500 rounded-lg overflow-hidden mt-[40px]"
          onClick={() => coverImage.current.click()}
        >
          <img src={frontendCoverImage} alt="" className="w-full" />
          <IoCameraOutline className="absolute right-[20px] top-[60px] w-[25px] h-[25px] text-white cursor-pointer" />
        </div>

        <div
          className="w-[60px] h-[60px] md:w-[75px] md:h-[75px] rounded-full overflow-hidden absolute top-[160px] left-[30px] cursor-pointer"
          onClick={() => profileImage.current.click()}
        >
          <img
            src={frontendProfileImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-[20px] h-[20px] bg-blue-400 absolute top-[190px] rounded-full flex justify-center items-center left-[90px] cursor-pointer">
          <IoMdAdd className="text-white" />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]">
          <input
            type="text"
            placeholder="First Name"
            className="w-full h-[50px] outline-none border-2 border-gray-600 px-[10px] py-[5px] text-[18px] rounded-lg"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full h-[50px] outline-none  border-2 border-gray-600 px-[10px] py-[5px] text-[18px] rounded-lg"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            type="text"
            placeholder="User Name"
            className="w-full h-[50px] outline-none  border-2 border-gray-600 px-[10px] py-[5px] text-[18px] rounded-lg"
            value={userName}
      onChange={(e) => setUserName(e.target.value)}          />

          <input
            type="text"
            placeholder="HeadLine"
            className="w-full h-[50px] outline-none  border-2 border-gray-600 px-[10px] py-[5px] text-[18px] rounded-lg"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full h-[50px] outline-none  border-2 border-gray-600 px-[10px] py-[5px] text-[18px] rounded-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="text"
            placeholder="Gender(male/female/other)"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[18px]"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          {/* skills */}
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h1 className="text-[19px] font-semibold">Skills</h1>
            {skills && (
              <div className="flex flex-col gap-[10px]">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="w-full h-[40px] border-[1px]border-gray-600 bg-gray-300 p-[10px] rounded-lg flex items-center justify-between"
                  >
                    <span>{skill}</span>
                    <RxCross2
                      className="w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-start">
              <input
                type="text"
                placeholder="Add new skill"
                value={newSkills}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[16px] cursor-pointer"
                onChange={(e) => setNewSkills(e.target.value)}
              />
              <button
                className="border border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
          </div>

          {/* education */}
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h1 className="text-[19px] font-semibold">Education</h1>
            {education && (
              <div className="flex flex-col gap-[10px]">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="w-full border-[1px]border-gray-600 bg-gray-300 p-[10px] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div>College: {edu.college}</div>
                      <div>Degree: {edu.degree}</div>
                      <div>Field of Study: {edu.fieldOfStudy}</div>
                    </div>
                    <RxCross2
                      className="w-[20px] h-[20px] cursor-pointer text-gray-800 font-bold"
                      onClick={() => removeEducation(edu)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-[10px] items-start">
              <input
                type="text"
                placeholder="College"
                value={newEducation.college}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[16px] cursor-pointer"
                onChange={(e) =>
                  setNewEducation({ ...newEducation, college: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Degree"
                value={newEducation.degree}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[16px] cursor-pointer"
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Field of Study"
                value={newEducation.fieldOfStudy}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[16px] cursor-pointer"
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    fieldOfStudy: e.target.value,
                  })
                }
              />

              <button
                className="border border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={addEducation}
              >
                Add
              </button>
            </div>
          </div>

          {/* experience */}
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h1 className="text-[19px] font-semibold">Experience</h1>
            {experience && (
              <div className="flex flex-col gap-[10px]">
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="w-full border-[1px]border-gray-600 bg-gray-300 p-[10px] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div>Title: {exp.title}</div>
                      <div>Company: {exp.company}</div>
                      <div>Description: {exp.description}</div>
                    </div>
                    <RxCross2
                      className="w-[20px] h-[20px] cursor-pointer text-gray-800 font-bold"
                      onClick={() => removeExperience(exp)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-[10px] items-start">
              <input
                type="text"
                placeholder="Title"
                value={newExperience.title}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[16px] cursor-pointer"
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Company"
                value={newExperience.company}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[16px] cursor-pointer"
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Description"
                value={newExperience.description}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] rounded-lg  border-2 text-[16px] cursor-pointer"
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
              />

              <button
                className="border border-blue-500 text-blue-500 py-2 px-4 w-full rounded-full hover:cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={addExperience}
              >
                Add
              </button>
            </div>
          </div>

          <button onClick={handleSaveProfile} className="mt-4 bg-blue-600 rounded-full hover:bg-blue-700 text-white p-2 mt-[50px] w-full" disabled={saving}>
            {saving?"Saving...":"Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
