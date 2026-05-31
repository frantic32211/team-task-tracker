import User from "../../models/User.js";

export const getUsersByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const users = await User.find({
      organization: organizationId,
    }).select("-password -refreshToken");

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const targetUser = req.targetUser;

    targetUser.role = role;
    await targetUser.save();

    return res.status(200).json({
      message: "Role updated successfully",
      user: targetUser,
    });
  } catch (err) {
    next(err);
  }
};
