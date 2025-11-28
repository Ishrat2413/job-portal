import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

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

    // Check if user exists and is job seeker
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.role !== "jobSeeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs",
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

    console.log("✅ Application created successfully:", newApplication._id);

    return res.status(201).json({
      message: "Application Submitted!",
      success: true,
    });
  } catch (error) {
    console.error("Application error:", error);
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
// export const getApplicants = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const userId = req.id;
//     const job = await Job.findById(jobId).populate({
//       path: "applications",
//       options: { sort: { createdAt: -1 } },
//       populate: { path: "applicant", options: { sort: { createdAt: -1 } } },

//       // applicant is from application.model.js
//     });
//     if (!job) {
//       return res.status(404).json({
//         message: "Job Not Found!",
//         success: false,
//       });
//     }
//     return res.status(200).json({ job, success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server Error",
//       success: false,
//     });
//   }
// };

// application.controller.js
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Populate applications with applicant details and profile
    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
        select: "fullName email phoneNumber profile", // Select specific fields
        populate: {
          path: "profile",
          select: "resume", // Select profile fields you need
        },
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    console.log("Job with populated applications:", job);

    return res.status(200).json({
      success: true,
      job: job,
      applicants: job.applications, // Also return applications separately for easier access
    });
  } catch (error) {
    console.error("Error in getApplicants:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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
