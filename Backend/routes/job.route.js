import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAllJobs,
  getEmployerJobs,
  getJobById,
  postJob,
} from "../controller/job.controller.js";

const router = express.Router();

router.route("/post").post(authenticateToken, postJob);
router.route("/get").get( getAllJobs);
router.route("/getEmployerJobs").get(authenticateToken, getEmployerJobs);
router.route("/get/:id").get(authenticateToken, getJobById);

export default router;
