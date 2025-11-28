import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// Get pending employers
export const getPendingEmployers = async (req, res) => {
  try {
    const pendingEmployers = await User.find({ 
      role: 'employer', 
      isApproved: false 
    }).select('-password');

    res.status(200).json({
      success: true,
      employers: pendingEmployers
    });
  } catch (error) {
    console.error('Error fetching pending employers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
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
    ).select('-password');

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: 'Employer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employer approved successfully',
      employer
    });
  } catch (error) {
    console.error('Error approving employer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Block user
export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      user
    });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Unblock user
export const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
      user
    });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all jobs for admin
export const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('employer', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};