import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const allUsers = await userModel.find({}, "name domain linkedin points email role profilePicture aboutMe year branch github");
    
    const isElevated = req.user && (req.user.role === "admin" || req.user.role === "superadmin");
    
    // Admins see everyone; students only see other students
    const visibleUsers = isElevated 
      ? allUsers 
      : allUsers.filter(u => u.role !== 'admin' && u.role !== 'superadmin');

    const groupedMembers = {
      webDev: visibleUsers.filter((u) => u.domain?.includes("web")),
      gameDev: visibleUsers.filter((u) => u.domain?.includes("game")),
      appDev: visibleUsers.filter((u) => u.domain?.includes("app")),
      other: visibleUsers.filter((u) => !u.domain || u.domain.length === 0),
    };

    res.json({
      success: true,
      allUsers: visibleUsers,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        domain: req.user.domain,
        points: req.user.points,
        profilePicture: req.user.profilePicture,
        aboutMe: req.user.aboutMe,
        year: req.user.year,
        branch: req.user.branch,
        github: req.user.github,
        linkedin: req.user.linkedin,
      },
      members: groupedMembers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const updated = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select("name domain linkedin github points profilePicture badges role aboutMe year branch");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch public profile" });
  }
};

export const getMyUserTasks = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const userTaskModel = (await import('../models/userTask.js')).default;
    const items = await userTaskModel.find({ email });
    res.json({ success: true, tasks: items });
  } catch (err) {
    console.error('getMyUserTasks error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user tasks' });
  }
};

// Public: anyone can access (Members Page)
export const getPublicUsersData = async (req, res) => {
  try {
    // Only fetch students for the public collective list
    const allUsers = await userModel.find(
      { role: { $nin: ['admin', 'superadmin'] } },
      "name domain linkedin github points profilePicture role badges"
    ).sort({ points: -1 });

    const groupedMembers = {
      webDev: allUsers.filter((u) => u.domain?.includes("web")),
      gameDev: allUsers.filter((u) => u.domain?.includes("game")),
      appDev: allUsers.filter((u) => u.domain?.includes("app")),
      other: allUsers.filter((u) => !u.domain || u.domain.length === 0),
    };

    res.json({
      success: true,
      members: groupedMembers,
      totalCount: allUsers.length
    });
  } catch (error) {
    console.error("GET_PUBLIC_USERS_ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};
