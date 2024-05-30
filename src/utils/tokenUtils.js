import crypto from "crypto";
import { User } from "../models/user.model.js";

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const saveResetToken = async (email, token) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();
};
