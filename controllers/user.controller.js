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
    // const updates = req.body;
    let updates = req.body;
 // IMPORTANT: Prevent dangerous fields from being updated
    delete updates._id;
    delete updates.email;
    delete updates.phone;
    delete updates.isPremium;
    delete updates.verified;

    // Convert arrays safely
    ["pronouns", "identities", "interests", "intentions"].forEach((key) => {
      if (typeof updates[key] === "string") {
        try {
          updates[key] = JSON.parse(updates[key]);
        } catch (err) {
          console.log(`${key} JSON parse error:`, err);
        }
      }
    });

    // ⚠️ IGNORE frontend-only fields
    delete updates.minAge;
    delete updates.maxAge;
    delete updates.distance;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select("-__v");

    return res.json({
      success: true,
      message: "Preferences saved",
      user,
    });

  } catch (err) {
    console.log("Update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const uploadPhotosController = async (req, res) => {
  try {
    if (!req.photoUrls || req.photoUrls.length === 0) {
      return res.status(400).json({ error: "No photos uploaded" });
    }

    const isSelfie = req.body.isSelfie == "true";

    // Prepare uploaded photos with default: verified:false
    const uploadedUrls = req.photoUrls.map((url) => ({
      url,
      verified: false
    }));

    // 1️⃣ Always add photos to user.photos (works for ALL screens)
    const pushResult = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { photos: { $each: uploadedUrls } } },
      { new: true }
    );

    // 2️⃣ Only run verification logic when isSelfie === true
    if (isSelfie) {
      const selfieUrl = req.photoUrls[0]; // first selfie

      // Mark the selfie photo as verified
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            verified: true, // User verified
            "photos.$[elem].verified": true // Mark only the selfie photo
          }
        },
        {
          arrayFilters: [{ "elem.url": selfieUrl }]
        }
      );
    }

    return res.json({
      success: true,
      message: "Photos uploaded successfully",
      photos: uploadedUrls,
      isSelfie,
    });

  } catch (err) {
    console.log("Error saving photos:", err);
    return res.status(500).json({ error: "Server error" });
  }
};



// update pricacy >>>

const updatePrivacySettings = async (req, res) => {
  try {
    const { privacy } = req.body;

    if (!privacy) {
      return res.status(400).json({
        success: false,
        message: "Privacy settings missing",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { privacy } },
      { new: true }
    ).select("-__v");

    return res.json({
      success: true,
      message: "Privacy settings updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    console.log("Privacy update error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = { createUser, getProfile, updateProfile,uploadPhotosController,updatePrivacySettings };
