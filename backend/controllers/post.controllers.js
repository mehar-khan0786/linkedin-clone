import Post from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    let newPost;

    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path);

      newPost = await Post.create({
        author: req.userId,
        description,
        image
      });

    } else {
      newPost = await Post.create({
        author: req.userId,
        description
      });
    }

    return res.status(201).json(newPost);

  } catch (err) {
    console.log("POST ERROR:", err);
    res.status(500).json({ message: "Create Post Error", error: err.message });
  }
};

export const getpost = async (req, res) => {
  try {
    const post = await Post.find().populate("author", "firstName lastName profile headline profileImage userName").populate("comment.user", "firstName lastName profile headline profileImage").sort({ createdAt: -1 });
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: "getPost error" });
  }
}

export const like = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    // ✅ TOGGLE LIKE
    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id.toString() !== userId.toString());
    } else {
      post.like.push(userId);
      if (userId.toString() !== post.author.toString()) {
        let notification = await Notification.create({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId
        })
      }
    }


    await post.save();
    io.emit("likeUpdated", { postId, likes: post.like });


    return res.status(200).json(post);

  } catch (error) {
    console.log("LIKE ERROR:", error);
    return res.status(500).json({ message: "like error" });
  }
};


export const comment = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment required" });
    }

    let post = await Post.findByIdAndUpdate(postId,
      {
        $push: { comment: { content, user: userId } }
      }
      , { new: true }).populate("comment.user", "firstName lastName profileImage headline");

    if (post.author != userId) {
      let notification = await Notification.create({
        receiver: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId
      })
    }


    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    io.emit("commentAdded", { postId, comm: post.comment });


    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: "comment error" })
  }
}