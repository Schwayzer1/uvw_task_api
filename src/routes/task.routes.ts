import express from "express";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth";
import {
  createTask,
  deleteTask,
  getTaskLogs,
  getTasksByProject,
  updateTask,
} from "../controllers/task.controller";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  createTask
);

router.get("/", authenticateJWT, getTasksByProject);

router.put("/:taskId", authenticateJWT, updateTask);

router.delete(
  "/:taskId",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  deleteTask
);

router.get("/:taskId/logs", authenticateJWT, getTaskLogs);

export default router;
