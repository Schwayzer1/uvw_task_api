import express from "express";
import {
  createProject,
  getUserProjects,
  getProjectById,
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
router.get("/:id", authenticateJWT, getProjectById);

export default router;
