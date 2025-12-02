const User = require("../models/User");

// POST → /api/auth/user
const createUser = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.create({ name });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log("Create User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET → /api/auth/me
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PUT → /api/auth/me
// PUT → /api/users/update
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
 // IMPORTANT: Prevent dangerous fields from being updated
    delete updates._id;
    delete updates.email;
    delete updates.phone;
    delete updates.isPremium;
    delete updates.verified;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select("-__v");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const uploadPhotosController = async (req, res) => {
   try {
    if (!req.photoUrls || req.photoUrls.length === 0) {
      return res.status(400).json({ error: "No photos uploaded" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { photos: { $each: req.photoUrls } }
    });

    res.json({ photos: req.photoUrls });
  } catch (err) {
    console.log("Error saving photos:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createUser, getProfile, updateProfile,uploadPhotosController };
