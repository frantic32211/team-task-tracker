import Task from "../../models/Task.js";
import Project from "../../models/Project.js";
import { redis } from "../../config/redis.js";
import { clearTaskCache } from "../../utils/clearTaskCache.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, project, assignedTo, due_date } =
      req.body;

    const existingProject = await Project.findOne({
      _id: project,
      organizationId: req.user.organizationId,
    });

    if (!existingProject) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    const dueDate = new Date(due_date);

    if (Number.isNaN(dueDate.getTime())) {
      return res.status(400).json({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid due_date",
      });
    }

    if (dueDate <= new Date()) {
      return res.status(400).json({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "due_date must be in the future",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      project,
      assignedTo,
      organizationId: req.user.organizationId,
      due_date,
      createdBy: req.user._id,
    });

    await clearTaskCache(req.user.organizationId);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const cacheKey = `tasks:${req.user.organizationId}:${req.user._id}:${page}:${limit}:${req.query.projectId || "all"}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    let filter = {
      organizationId: req.user.organizationId,
    };

    if (req.user.role === "MEMBER") {
      filter.assignedTo = req.user._id;
    }

    if (req.query.projectId) {
      filter.project = req.query.projectId;
    }

    const tasks = await Task.find(filter)
      .populate("project", "project_name")
      .populate("assignedTo", "full_name email role")
      .populate("createdBy", "full_name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    const response = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tasks,
    };

    // cache for 60 sec
    await redis.setex(cacheKey, 60, JSON.stringify(response));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Task not found",
      });
    }

    const sameOrg =
      req.user.organizationId.toString() === task.organizationId.toString();

    if (!sameOrg) {
      return res.status(403).json({
        status: 403,
        code: "FORBIDDEN",
        message: "Cross-organization access denied",
      });
    }

    const isAssignee =
      task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    const isManager = req.user.role === "MANAGER";

    if (!isAssignee && !isManager) {
      return res.status(403).json({
        status: 403,
        code: "FORBIDDEN",
        message: "Not allowed to update this task",
      });
    }

    const currentStatus = task.status;
    const newStatus = status;

    const ALLOWED_TRANSITIONS = {
      TODO: ["IN_PROGRESS", "BLOCKED"],
      IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],
      IN_REVIEW: ["DONE", "BLOCKED"],
      BLOCKED: ["TODO"],
      DONE: [],
    };

    if (!ALLOWED_TRANSITIONS[currentStatus].includes(newStatus)) {
      return res.status(400).json({
        status: 400,
        code: "INVALID_STATUS_TRANSITION",
        message: `Cannot move task from ${currentStatus} to ${newStatus}`,
      });
    }

    task.status = newStatus;
    await task.save();

    await clearTaskCache(req.user.organizationId);

    const updatedTask = await Task.findById(id)
      .populate("project", "project_name")
      .populate("assignedTo", "full_name email role");

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!task) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Task not found",
      });
    }

    await clearTaskCache(req.user.organizationId);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};
