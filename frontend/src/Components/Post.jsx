import React, { useEffect, useState } from "react";
import moment from "moment";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import axios from "axios";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext";
import { socket, userDataContext } from "../context/UserContext";
import { AiFillLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import ConnectionButton from "./ConnectionButton";


function Post({ id, author, like, comment, description, image, createdAt }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData,handleGetProfile } = useContext(userDataContext);

  const [more, setMore] = useState(false);
  const [likes, setLikes] = useState(like || []);
  const [comments, setComments] = useState(comment || []);
  const [commentContent, setCommentContent] = useState("");
  const [showComment, setShowComment] = useState(false);

  // ✅ LIKE FUNCTION
  const handleLike = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/post/like/${id}`,
        { withCredentials: true }
      );

      setLikes(res.data.like);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ COMMENT FUNCTION
  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) return;

    try {
      const res = await axios.post(
        `${serverUrl}/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true }
      );

      setComments(res.data.comment);
      setCommentContent("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    socket.on("likeUpdated",({postId,likes})=>{
      if(postId===id){
        setLikes(likes);
      }
    })

    return ()=>{
      socket.off("likeUpdated");
    }
  },[id])


   useEffect(()=>{
    socket.on("commentAdded",({postId,comm})=>{
      if(postId===id){
        setComments(comm);
      }
    })

    return ()=>{
      socket.off("commentAdded");
    }
  },[id])


  return (
    <div className="w-full bg-white rounded-lg shadow-md flex flex-col gap-[20px] p-[20px]">
      
      {/* USER INFO */}
     <div className="flex items-center gap-3">

  {/* PROFILE IMAGE */}
  <div className="w-[50px] h-[50px] cursor-pointer rounded-full overflow-hidden" onClick={() => handleGetProfile(author?.userName)}>
    <img
      src={author?.profileImage || "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=211&h=211&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
      alt=""
      className="w-full h-full object-cover"
    />
  </div>

  {/* USER INFO */}
  <div>
    <div className="font-semibold text-[18px]">
      {author?.firstName} {author?.lastName}
    </div>
    <div className="text-sm text-gray-500">
      {author?.headline}
    </div>
    <div className="text-sm text-gray-400">
      {moment(createdAt).fromNow()}
    </div>
  </div>

  {/* RIGHT SIDE BUTTON */}
  <div className="ml-auto">
    {
     String(userData?.user?._id) !== String(author?._id) && (
        <ConnectionButton userId={author?._id} />
      )
    }
    </div>

</div>


      {/* DESCRIPTION */}
      <div className={`pl-[50px] ${!more ? "max-h-[100px] overflow-hidden" : ""}`}>
        {description}
      </div>

      <div
        className="pl-[50px] text-blue-600 cursor-pointer"
        onClick={() => setMore(!more)}
      >
        {more ? "read less..." : "read more..."}
      </div>

      {/* IMAGE */}
      {image && (
        <div className="w-full h-[350px] overflow-hidden rounded-lg">
          <img src={image} className="w-full h-full object-cover" />
        </div>
      )}

      {/* LIKE + COMMENT COUNT */}
      <div className="flex justify-between text-gray-600">
        <div className="flex gap-2 items-center">
          <BiLike className="text-blue-600" />
          {likes.length}
        </div>

        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setShowComment(prev => !prev)}
        >
          <FaRegCommentDots />
          {comments.length} comments
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-6 border-t pt-2">
        
        {/* LIKE */}
        {likes.includes(userData?.user?._id) ? (
          <div onClick={handleLike} className="flex justify-center items-center gap-2 cursor-pointer text-blue-600">
            <AiFillLike className="h-[25px] w-[25px] " />
            <p>liked</p>
          </div>
        ) : (
          <div onClick={handleLike} className="flex justify-center items-center gap-2 cursor-pointer">
            <BiLike className="h-[25px] w-[25px]"/>
            like
          </div>
        )}

        {/* COMMENT */}
        <div
          className="flex cursor-pointer gap-2 cursor-pointer justify-center items-center"
          onClick={() => setShowComment(prev => !prev)}
        >
          <FaRegCommentDots className="h-[25px] w-[25px]"/>
          comment
        </div>
      </div>

      {/* COMMENTS SECTION */}
      {showComment && (
        <div className="flex flex-col gap-3">
          
          {/* INPUT */}
          <form
            onSubmit={handleComment}
            className="flex items-center border-b pb-2"
          >
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="w-full outline-none"
            />

            <button type="submit">
              <IoSend className="text-blue-600 text-2xl cursor-pointer hover:text-blue-800 hover:text-3xl" />
            </button>
          </form>

          {/* COMMENTS LIST */}
          {comments.map((comm, index) => (
            <div key={index} className="flex gap-3">
              
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                <img
                  src={comm.user?.profileImage || "https://via.placeholder.com/150"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-gray-100 p-2 rounded-lg w-full">
                <div className="font-semibold text-sm">
                  {comm.user?.firstName} {comm.user?.lastName}
                </div>

                <div className="text-xs text-gray-500">
                {moment(createdAt).fromNow()}

                </div>

                <div className="text-sm">{comm.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Post;