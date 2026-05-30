import Task from "../../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, project, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      project,
      assignedTo,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "project_name")
      .populate("assignedTo", "full_name email role")
      .populate("createdBy", "full_name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
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
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
