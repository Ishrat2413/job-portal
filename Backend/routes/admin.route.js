import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getPendingEmployers,
  approveEmployer,
  getAllUsers,
  blockUser,
  unblockUser,
  getAllJobsAdmin,
  getAllApplications,
} from "../controller/admin.controller.js";

const router = express.Router();

// All routes protected and admin only
router.get("/employers/pending", authenticateToken, getPendingEmployers);
router.put("/employers/:id/approve", authenticateToken, approveEmployer);
router.get("/users", authenticateToken, getAllUsers);
router.put("/users/:id/block", authenticateToken, blockUser);
router.put("/users/:id/unblock", authenticateToken, unblockUser);
router.get("/jobs", authenticateToken, getAllJobsAdmin);
router.get("/applications", authenticateToken, getAllApplications);

export default router;