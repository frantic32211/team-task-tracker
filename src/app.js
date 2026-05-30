import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import projectRoutes from "./modules/projects/project.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Team Task Tracker API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/profile", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

export default app;
