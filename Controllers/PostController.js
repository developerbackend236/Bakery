const Product = require("../Models/ProductModal.js");
const Book = require("../Models/BookModal.js");
const User = require("../Models/UserModal.js");
const BookModal = require("../Models/BookModal.js");
const PostModal = require("../Models/PostModal.js");
class PostController {
  static createPost = async (req, res) => {
    try {
      const userData = req.user;
      const postPicture = req.file;
      const { caption } = req.body;

      const createPost = await PostModal({
        postCreatorId: userData._id,
        PostImage: postPicture?.filename,
        caption: caption,
      });

      await createPost.save();

      res.send({
        message: "post created successfully",
      });
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  };

  static getAllPost = async (req, res) => {
    try {
      const allPost = await PostModal.find({}).populate({
        path: "postCreatorId",
        select: "-password", // Exclude the password field
      })

      res.send({
        message: "all post",
        imageUrl: "https://khvw9wf1-3020.inc1.devtunnels.ms/api/post/",
        data: allPost,
      });
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  };

  static LikeAPost = async (req, res) => {
    const currentUser = req.user; // Assuming req.user is populated with the current logged-in user's data
    const { postId } = req.body;

    try {
      // Find the post by ID
      const findpost = await PostModal.findOne({ _id: postId });

      if (!findpost) {
        return res.status(404).send({ message: "Post not found" });
      }

      // Check if the user already liked the post
      const alreadyLiked = findpost.PostLikes.some(
        (userId) => userId.toString() === currentUser._id.toString()
      );

      if (alreadyLiked) {
        // User already liked the post, so remove the like
        findpost.PostLikes = findpost.PostLikes.filter(
          (userId) => userId.toString() !== currentUser._id.toString()
        );

        await findpost.save();

        return res.send({ message: "Post disliked" });
      } else {
        // User hasn't liked the post, so add the like
        findpost.PostLikes.push(currentUser._id);

        await findpost.save();

        return res.send({ message: "Post liked" });
      }
    } catch (error) {
      res.status(500).send({
        message: "An error occurred",
        error: error.message,
      });
    }
  };

  static CommentAPost = async (req, res) => {
    const currentUser = req.user; 
    const { postId, comment } = req.body; 

    try {

        const findpost = await PostModal.findOne({ _id: postId });

        if (!findpost) {
            return res.status(404).send({ message: "Post not found" });
        }

        findpost.PostComment.push({
            userId: currentUser._id, 
            comment: comment, 
        });

        await findpost.save();

        res.status(200).send({
            message: "Comment added successfully",
            post: findpost,
        });
    } catch (error) {
        res.status(500).send({
            message: "An error occurred",
            error: error.message,
        });
    }
  };


  static ShareAPost = async (req, res) => {
    const currentUser = req.user; 
    const { postId } = req.body; 

    try {

        const findpost = await PostModal.findOne({ _id: postId });

        if (!findpost) {
            return res.status(404).send({ message: "Post not found" });
        }

        findpost.PostShare.push(currentUser._id);

        await findpost.save();

        res.status(200).send({
            message: "Comment added successfully",
            post: findpost,
        });
    } catch (error) {
        res.status(500).send({
            message: "An error occurred",
            error: error.message,
        });
    }
  };

}

module.exports = PostController;
