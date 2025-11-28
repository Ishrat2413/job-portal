import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing Required Fields",
        success: false,
      });
    }
    let profilePhoto = "";
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email Already Exists!",
        success: false,
      });
    }

    // Convert password to hash
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhoto,
      },
    });
    // saved user
    await newUser.save();
    return res.status(201).json({
      message: `Account Created Successfully ${fullName}`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error Register",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Missing Required Fields",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect User Or password!",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect User Or password!",
        success: false,
      });
    }
    // Check the role
    if (user.role !== role) {
      return res.status(400).json({
        message: "You don't have the necessary role to access this resource!",
        success: false,
      });
    }
    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked. Contact admin.",
        success: false,
      });
    }

    // Generate token
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullName}!`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error Login",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out Successfully!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error Logout",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // console.log("Full req.body:", req.body);
    const skills =
      req.body.skills ||
      (req.body["skills[]"] ? JSON.parse(req.body["skills[]"]) : []);
    const fullName = req.body.fullName || req.body["fullName[]"];
    const email = req.body.email || req.body["email[]"];
    const bio = req.body.bio || req.body["bio[]"];

    const file = req.file;
    // cloudinary upload
    let cloudinaryResponse = null;

    if (file) {
      console.log("Processing file upload...");
      const fileUri = getDataUri(file);
      cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content);
      console.log("Cloudinary upload successful");
    }

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not Found!",
        success: false,
      });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (bio) user.profile.bio = bio;

    // Handle skills
    if (skills) {
      const skillsArray =
        typeof skills === "string"
          ? skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== "")
          : skills;
      user.profile.skills = skillsArray;
    }

    // Handle file
    // if (req.file) {
    //   user.profile.resume = `uploads/${req.file.originalname}`;
    //   user.profile.resumeOriginalName = req.file.originalname;
    // }

    if (cloudinaryResponse && file) {
      user.profile.resume = cloudinaryResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }
    await user.save();

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile Updated Successfully!",
      user: userResponse,
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Server Error updating profile",
      success: false,
    });
  }
};
