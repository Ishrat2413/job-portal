import { Job } from "../models/job.model.js";
import {User} from "../models/user.model.js"

// Employer Job Post
export const postJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      requirements,
      jobType,
      salaryRange,
      employer,
      experience,
      isActive,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !company ||
      !description ||
      !location ||
      !requirements ||
      !jobType ||
      !salaryRange ||
      !experience
    ) {
      res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    const job = await Job({
      title,
      company,
      description,
      location,
      requirements: requirements || [],
      jobType,
      salaryRange,
      employer: req.id,
      experience: parseInt(experience),
      isActive: true,
    });
    await job.save();
    const user = await User.findById(userId);
    if (user.role === "employer" && !user.isApproved) {
      return res.status(403).json({
        message: "Your account is pending approval by admin.",
        success: false,
      });
    }
    return res.status(201).json({
      message: "Job Posted Successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Get all jobs for job seekers
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "employer",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "No Jobs Found!",
        status: false,
      });
    }
    return res.status(200).json({
      jobs,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Get single job by id
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({
        path: "employer",
      })
      .sort({ createdAt: -1 });
    if (!job) {
      return res.status(404).json({
        message: "No Jobs Found!",
        status: false,
      });
    }
    return res.status(200).json({
      job,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Get employer's job
export const getEmployerJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ employer: adminId })
      .populate({
        path: "employer",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "No Jobs Found!",
        status: false,
      });
    }
    return res.status(200).json({
      jobs,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
