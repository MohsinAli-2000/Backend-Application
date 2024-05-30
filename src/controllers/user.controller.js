import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import  ApiError  from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller for user registration
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if ([username, email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json(new ApiError(409, "User with this email already exists."));
    }

    // Create a new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Select user data without password
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      return res
        .status(500)
        .json(new ApiError(500, "Something went wrong while registering user"));
    }

    // Generate JWT token
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return response with user data and token
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...createdUser._doc, token },
          "User has been registered successfully!"
        )
      );
  } catch (error) {
    // Handle errors
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

// Controller for user login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if ([email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalid credentials"));
    }

    // Check if password matches
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json(new ApiError(401, "Invalid credentials"));
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return response with user data and token
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...user._doc, token },
          "User has been logged in successfully!"
        )
      );
  } catch (error) {
    // Handle errors
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

// Controller for updating user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { username, email, name } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.name = name || user.name;

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult) {
        return res
          .status(500)
          .json(new ApiError(500, "Failed to upload image"));
      }
      user.profilePicture = uploadResult.secure_url;
    }

    const updatedUser = await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "User profile updated successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

// Controller for deleting user account
export const deleteUserAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user by ID and delete it
    await User.findByIdAndDelete(userId);

    res.status(200).json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
