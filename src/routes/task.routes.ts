import express from "express";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth";
import {
  createTask,
  deleteTask,
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

router.put(
  "/:taskId",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  updateTask
);

router.delete(
  "/:taskId",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  deleteTask
);

export default router;
