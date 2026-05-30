import Project from "../../models/Project.js";

export const createProject = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user);

    const { project_name, description, members = [] } = req.body;

    const project = await Project.create({
      project_name,
      description,
      owner: req.user._id,
      members,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "project_name email role")
      .populate("members", "project_name email role");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
