import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Invalid Job Id",
        success: false,
      });
    }
    // check if the user have already applied for that job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job!",
        success: false,
      });
    }
    // check if job exists or not
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not Found",
        success: false,
      });
    }
    // create new applicant
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Application Submitted!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({
      applicant: userId,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "job", options: { sort: { createdAt: -1 } } });
    if (!applications) {
      return res.status(404).json({
        message: "No Applications Found!",
        success: false,
      });
    }
    return res.status(200).json({ applications, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// employer & admin can see
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant", options: { sort: { createdAt: -1 } } },

      // applicant is from application.model.js
    });
    if (!job) {
      return res.status(404).json({
        message: "Job Not Found!",
        success: false,
      });
    } 
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

// export const getApplicants = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const userId = req.id; // Current user ID

//     // First, verify the job exists and user has permission
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({
//         message: "Job Not Found!",
//         success: false,
//       });
//     }

//     // Check if user is employer of this job OR admin
//     const user = await User.findById(userId);
//     if (user.role !== "admin" && job.employer.toString() !== userId) {
//       return res.status(403).json({
//         message: "Access denied. Only employer or admin can view applicants.",
//         success: false,
//       });
//     }

//     // Populate applications and applicants
//     const jobWithApplicants = await Job.findById(jobId).populate({
//       path: "applications",
//       options: { sort: { createdAt: -1 } },
//       populate: {
//         path: "applicant",
//         select: "fullName email profile",
//         options: { sort: { createdAt: -1 } },
//       },
//     });

//     return res.status(200).json({
//       job: jobWithApplicants,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server Error",
//       success: false,
//     });
//   }
// };

// accepted or rejected or pending
export const updateStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(404).json({
        message: "Invalid Status",
        success: false,
      });
    }
    // find the application by applicant id
    const application = await Application.findById({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not Found!",
        success: false,
      });
    }

    // Update the status
    application.status = status.toLowerCase();

    await application.save();
    return res.status(200).json({
      message: "Application Status Updated",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
