import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import { createProject, getProjects } from "./project.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  createProject,
);

router.get("/", authMiddleware, getProjects);

export default router;
