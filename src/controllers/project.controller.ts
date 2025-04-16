import { Request, Response } from "express";
import Project, { IProject } from "../models/Project";
import { AuthRequest } from "../middlewares/auth";
import Joi from "joi";
import Task from "../models/Task";

const createProjectSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Proje başlığı boş olamaz",
    "any.required": "Proje başlığı zorunludur",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Proje açıklaması boş olamaz",
    "any.required": "Proje açıklaması zorunludur",
  }),
});

export const createProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { error } = createProjectSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const { title, description } = req.body;

    const newProject = await Project.create({
      title,
      description,
      createdBy: req.user!.userId,
      members: [req.user!.userId],
    });

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err });
  }
};

export const getUserProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ members: req.user!.userId }).populate(
      "members createdBy"
    );
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<IProject | any> => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      isDelete: false,
    }).populate("members createdBy");

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or access denied" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project", error });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ isDelete: false }).populate(
      "members createdBy"
    );
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;

  try {
    const deleted = await Project.findByIdAndUpdate(projectId, {
      isDelete: true,
    });
    if (!deleted) {
      res.status(404).json({ message: "Proje bulunamadı" });
      return;
    }
    await Task.updateMany({ projectId }, { $set: { isDelete: true } });

    res.status(200).json({ message: "Proje ve görevler başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ message: "Proje silinemedi", error: err });
  }
};
