import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import projectRoutes from "./modules/projects/project.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import organizationRoutes from "./modules/organizations/organization.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Team Task Tracker API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);

app.get("/api/profile", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

app.use((err, req, res, next) => {
  console.log("ERROR HIT:", err);
  console.log("NEXT TYPE:", typeof next);
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    status: 500,
    code: "SERVER_ERROR",
    message: err.message || "Internal Server Error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

export default app;
