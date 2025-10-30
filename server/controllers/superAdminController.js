import adminConfigModel from "../models/adminConfig.js";
import userModel from "../models/userModel.js"; 

export const addAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const requester = req.user.email;

    if (requester !== process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    let config = await adminConfigModel.findOne();
    if (!config) config = new adminConfigModel();

    if (config.admins.includes(email)) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found with this email" });
    }

    user.role = "admin";
    await user.save();

    config.admins.push(email);
    await config.save();

    res.json({
      success: true,
      message: "Admin added successfully",
      admins: config.admins,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const requester = req.user.email;
    console.log("Requester email:", requester);

    if (requester !== process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const config = await adminConfigModel.findOne();
    if (!config) return res.json({ success: false, message: "No admin list found" });

    config.admins = config.admins.filter((admin) => admin !== email);
    await config.save();

    await userModel.findOneAndUpdate({ email }, { role: "student" });

    res.json({
      success: true,
      message: "Admin removed successfully",
      admins: config.admins,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
