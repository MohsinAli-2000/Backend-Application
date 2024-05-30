// auth.controller.js

import { User } from "../models/user.model.js";
import { generateResetToken, saveResetToken } from "../utils/tokenUtils.js";
import { sendResetEmail } from "../utils/nodemailerFile.js";

// Controller for requesting password reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  // Validate email address
  if (!email || !email.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Email address is required." });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  // Generate reset token
  const token = generateResetToken();

  // Save reset token in database
  await saveResetToken(email, token);

  // Send reset email
  await sendResetEmail(email, token);

  return res.status(200).json({
    success: true,
    message: "Password reset email sent successfully.",
  });
};

// Controller for completing password reset
export const completePasswordReset = async (req, res) => {
  const { email, token, newPassword } = req.body;

  // Validate required fields
  if (!email || !token || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Find the user by email and token
  const user = await User.findOne({
    email,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token." });
  }

  // Update user's password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully.",
  });
};
