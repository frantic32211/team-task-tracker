import User from "../models/User.js";

export const createSuperAdmin = async () => {
  try {
    console.log("createSuperAdmin running");
    const existing = await User.findOne({ role: "SUPER_ADMIN" });

    if (existing) return;

    const user = await User.create({
      full_name: "Super Admin",
      email: "admin@system.com",
      password: "admin123",
      role: "SUPER_ADMIN",
    });

    console.log("SUPER_ADMIN created successfully:", user.email);
  } catch (error) {
    console.error("Error creating SUPER_ADMIN:", error.message);
  }
};
