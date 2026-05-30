import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        code: "AUTH_ERROR",
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        status: 401,
        code: "AUTH_ERROR",
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      code: "AUTH_ERROR",
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
