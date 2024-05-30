// auth.routes.js

import express from "express";
import {
  requestPasswordReset,
  completePasswordReset
} from "../controllers/auth.controller.js";

const router = express.Router();

// Route for requesting password reset
router.post("/reset-password/request", requestPasswordReset);

// Route for completing password reset
router.post("/reset-password/complete", completePasswordReset);

export default router;
