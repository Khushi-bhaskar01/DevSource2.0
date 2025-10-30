export const verifySuperAdmin = (req, res, next) => {
  try {

    if (!req.user || req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Access denied" });
      
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
