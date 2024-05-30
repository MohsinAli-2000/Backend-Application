import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import  ApiError  from "../utils/ApiError.js";

// Middleware to check if the user is an admin
export const isAdmin = (req, res, next) => {
  // Check if user is logged in and is an admin
  if (req.user && req.user.role === "admin") {
    next(); // Proceed to the next middleware
  } else {
    // User is not authorized to access this route
    res.status(403).json({ message: "Forbidden" });
  }
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json(new ApiError(401, "Not authorized, user not found"));
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json(new ApiError(401, "Not authorized, token failed"));
    }
  }

  if (!token) {
    return res.status(401).json(new ApiError(401, "Not authorized, no token"));
  }
};
