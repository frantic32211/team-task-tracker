import express from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "./organization.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("SUPER_ADMIN"),
  createOrganization,
);

router.get("/", authMiddleware, getOrganizations);

router.get("/:id", authMiddleware, getOrganizationById);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("SUPER_ADMIN"),
  updateOrganization,
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("SUPER_ADMIN"),
  deleteOrganization,
);

export default router;
