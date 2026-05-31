import Organization from "../../models/Organization.js";

export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Organization.findOne({ name });

    if (existing) {
      return res.status(400).json({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Organization already exists",
      });
    }

    const org = await Organization.create({
      name,
      description,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Organization created successfully",
      org,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });

    return res.status(200).json(orgs);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);

    if (!org) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    return res.status(200).json(org);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true },
    );

    if (!org) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      message: "Organization updated",
      org,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);

    if (!org) {
      return res.status(404).json({
        status: 404,
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      message: "Organization deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      code: "SERVER_ERROR",
      message: error.message,
    });
  }
};
