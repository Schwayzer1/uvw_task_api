import { Router } from "express";
import userRoutes from "./auth.routes";
import projectRoutes from "./project.routes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/project", projectRoutes);

export default router;
