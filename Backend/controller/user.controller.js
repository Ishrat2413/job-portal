import { User } from "../models/user.model.js";

export const register = async (res, req) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        message: "Missing Required Fields",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email Already Exists!",
        success: false,
      });
    }

    // Convert password to hash
  } catch (error) {}
};
