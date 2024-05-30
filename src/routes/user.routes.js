import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/user.controller.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = Router();

// Register user route (public)
router.route("/register").post(registerUser);

// Login user route (public)
router.route("/login").post(loginUser);

// Protected route to fetch user profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({ message: "Profile data", user: req.user });
});

// Protected route to update user profile (only for authenticated users)
router.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateUserProfile
);

// Route for deleting user account (protected)
router.delete("/profile", protect, deleteUserAccount);


//admin dashboard route
router.get('/admin/dashboard', protect, isAdmin, asyncHandler(async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to access this resource.' });
    }

    // Fetch real-time data
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments(); 

    const dashboardData = {
      totalUsers,
      totalPosts,
    };

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard data',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}));

export default router;
