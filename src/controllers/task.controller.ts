import { Request, Response } from "express";
import Joi from "joi";
import Task from "../models/Task";
import Project from "../models/Project";
import { AuthRequest } from "../middlewares/auth";

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string()
    .valid("pending", "in-progress", "completed")
    .default("pending"),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  assignedTo: Joi.string().optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  priority: Joi.string().valid("low", "medium", "high"),
  assignedTo: Joi.string().allow(null, ""),
});

export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;

  const { error } = createTaskSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  console.log(req.user.userId, "userIddddddd");

  try {
    const project = await Project.findOne({
      _id: projectId,
      members: req.user!.userId,
    });

    if (!project) {
      res.status(403).json({ message: "Bu projeye erişiminiz yok" });
      return;
    }

    const task = await Task.create({
      ...req.body,
      projectId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Görev oluşturulamadı", error: err });
  }
};

export const getTasksByProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({
      _id: projectId,
      members: req.user!.userId,
    });

    if (!project) {
      res.status(403).json({ message: "Bu projeye erişiminiz yok" });
      return;
    }

    const tasks = await Task.find({ projectId }).populate(
      "assignedTo",
      "name email role"
    );

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Görevler alınamadı", error: err });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { error } = updateTaskSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });

    if (!updatedTask) {
      res.status(404).json({ message: "Görev bulunamadı" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Görev güncellenemedi", error: err });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    const deleted = await Task.findByIdAndDelete(taskId);
    if (!deleted) {
      res.status(404).json({ message: "Görev bulunamadı" });
      return;
    }

    res.status(200).json({ message: "Görev başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ message: "Görev silinemedi", error: err });
  }
};
