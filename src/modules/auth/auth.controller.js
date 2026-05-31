import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import Organization from "../../models/Organization.js";
import { generateAccessToken, generateRefreshToken } from "./auth.utils.js";
import { refreshAccessToken as refreshTokenService } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, password, role, organizationId } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Email already exists",
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "organizationId is required",
      });
    }

    const organizationDoc = await Organization.findById(organizationId);

    if (!organizationDoc) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    const user = await User.create({
      full_name,
      email,
      password,
      role,
      organization: organizationDoc._id,
    });

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        organization: organizationDoc.name,
        organizationId: organizationDoc._id,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 401,
        code: "AUTH_ERROR",
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        code: "AUTH_ERROR",
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const tokens = await refreshTokenService(req.body.refreshToken);

    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(401).json({
      status: 401,
      code: "AUTH_ERROR",
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      status: 404,
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  user.refreshToken = null;

  await user.save();

  res.status(200).json({
    message: "Logged out",
  });
};
