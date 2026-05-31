import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import { getUsersByOrganization, updateUserRole } from "./user.controller.js";
import authorizeRoleUpdate from "../../middlewares/roleUpdate.middleware.js";

const router = express.Router();

router.get(
  "/organization/:organizationId",
  authMiddleware,
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  getUsersByOrganization,
);

router.patch(
  "/:userId/role",
  authMiddleware,
  authorizeRoleUpdate,
  updateUserRole,
);

export default router;
