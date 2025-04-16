import express from "express";
import {
  createProject,
  getUserProjects,
  getProjectById,
  getAllProjects,
  deleteProject,
} from "../controllers/project.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  createProject
);
router.get("/", authenticateJWT, getUserProjects);
router.get("/all", getAllProjects);
router.get("/:id", getProjectById);
router.put(
  "/:projectId",
  authenticateJWT,
  authorizeRoles("Admin", "Manager"),
  deleteProject
);

export default router;
