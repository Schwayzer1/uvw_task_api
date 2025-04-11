import { Router } from "express";
import userRoutes from "./auth.routes";
import projectRoutes from "./project.routes";
import taskRoutes from "./task.routes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/projects", projectRoutes);
router.use("/projects/:projectId/tasks", taskRoutes);

export default router;
