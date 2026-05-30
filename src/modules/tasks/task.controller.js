import Task from "../../models/Task.js";
import Project from "../../models/Project.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, project, assignedTo } =
      req.body;

    const existingProject = await Project.findOne({
      _id: project,
      organization: req.user.organization,
    });

    if (!existingProject) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      project,
      assignedTo,
      organization: req.user.organization,
      createdBy: req.user._id,
    });

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
    let filter = {
      organization: req.user.organization,
    };

    if (req.user.role === "member") {
      filter.assignedTo = req.user._id;
    }

    if (req.query.projectId) {
      filter.project = req.query.projectId;
    }

    const tasks = await Task.find(filter)
      .populate("project", "project_name")
      .populate("assignedTo", "full_name email role")
      .populate("createdBy", "full_name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
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

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true })
      .populate("project", "project_name")
      .populate("assignedTo", "full_name email role");

    if (!task) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
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

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Task not found",
      });
    }

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
