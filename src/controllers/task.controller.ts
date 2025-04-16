import { Request, Response } from "express";
import Joi from "joi";
import Task from "../models/Task";
import Project from "../models/Project";
import { AuthRequest } from "../middlewares/auth";
import TaskLog from "../models/TaskLog";

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

  if (!projectId) {
    res.status(400).json({ message: "Project ID eksik" });
    return;
  }

  const { error } = createTaskSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

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
      isDelete: false,
    });

    if (!project) {
      res.status(403).json({ message: "Bu projeye erişiminiz yok" });
      return;
    }

    const tasks = await Task.find({ projectId, isDelete: false }).populate(
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
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      res.status(404).json({ message: "Görev bulunamadı" });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });

    if (req.body.status && req.body.status !== existingTask.status) {
      await TaskLog.create({
        taskId: existingTask._id,
        oldStatus: existingTask.status,
        newStatus: req.body.status,
        updatedBy: req.user!.userId,
      });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Görev güncellenemedi", error: err });
  }
};

export const getTaskLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    const logs = await TaskLog.find({ taskId })
      .populate("updatedBy", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Görev geçmişi alınamadı", error: err });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  try {
    const deleted = await Task.findByIdAndUpdate(taskId, { isDelete: true });
    if (!deleted) {
      res.status(404).json({ message: "Görev bulunamadı" });
      return;
    }

    res.status(200).json({ message: "Görev başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ message: "Görev silinemedi", error: err });
  }
};
