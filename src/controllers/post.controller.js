import Post from '../models/post.model.js';
import ApiError from '../utils/ApiError.js';

// Controller to create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      author: req.user._id, 
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Server error'));
  }
};

// Controller to get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username'); // Populate the author field with username
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Server error'));
  }
};

// Controller to get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('author', 'username');
    if (!post) {
      return res.status(404).json(new ApiError(404, 'Post not found'));
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Server error'));
  }
};

// Controller to update a post by ID
export const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json(new ApiError(404, 'Post not found'));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Server error'));
  }
};

// Controller to delete a post by ID
export const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json(new ApiError(404, 'Post not found'));
    }
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Server error'));
  }
};
