// routes/post.routes.js

import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
} from "../controllers/post.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/posts").get(getAllPosts).post(protect, createPost);
router
  .route("/posts/:id")
  .get(getPostById)
  .put(protect, updatePostById)
  .delete(protect, deletePostById);

export default router;
