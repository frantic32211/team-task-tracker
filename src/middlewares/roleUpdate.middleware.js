import User from "../models/User.js";

const validRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "MEMBER"];

export const authorizeRoleUpdate = async (req, res, next) => {
  try {
    const requester = req.user;
    const { role } = req.body;
    const { userId } = req.params;

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // prevent updating SUPER_ADMIN
    if (targetUser.role === "SUPER_ADMIN") {
      return res.status(403).json({
        message: "SUPER_ADMIN role cannot be modified",
      });
    }

    if (requester.role === "SUPER_ADMIN") {
      req.targetUser = targetUser;
      return next();
    }

    if (requester.role === "ADMIN") {
      const allowed = ["MANAGER", "MEMBER"];

      if (!allowed.includes(role)) {
        return res.status(403).json({
          message: "ADMIN can only assign MANAGER or MEMBER roles",
        });
      }

      req.targetUser = targetUser;
      return next();
    }

    return res.status(403).json({
      message: "Not allowed to update roles",
    });
  } catch (err) {
    next(err);
  }
};

export default authorizeRoleUpdate;
