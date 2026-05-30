import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "./task.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  createTask,
);

router.patch("/:id/status", authMiddleware, updateTaskStatus);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "manager"),
  deleteTask,
);

router.get("/", authMiddleware, getTasks);

export default router;
