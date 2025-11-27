import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// Get pending employers
export const getPendingEmployers = async (req, res) => {
  try {
    const employers = await User.find({ 
      role: "employer", 
      isApproved: false 
    }).select("-password");

    return res.status(200).json({
      success: true,
      employers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Approve employer
export const approveEmployer = async (req, res) => {
  try {
    const employerId = req.params.id;
    const employer = await User.findByIdAndUpdate(
      employerId,
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!employer) {
      return res.status(404).json({
        message: "Employer not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Employer approved successfully!",
      success: true,
      employer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Block/unblock user
export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User blocked successfully!",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User unblocked successfully!",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Get all jobs (admin view)
export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employer", "fullName email");
    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// Get all applications (admin view)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title company")
      .populate("applicant", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};