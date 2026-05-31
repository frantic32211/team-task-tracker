import Project from "../../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { project_name, description, members = [] } = req.body;

    const project = await Project.create({
      project_name,
      description,
      owner: req.user._id,
      organization: req.user.organization,
      members,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "MEMBER") {
      filter.members = req.user._id;
    }
    const projects = await Project.find(filter)
      .populate("owner", "project_name email role")
      .populate("members", "project_name email role");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};
