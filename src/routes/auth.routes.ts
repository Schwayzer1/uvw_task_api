import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
  updateUserRole,
} from "../controllers/auth.controller";
import { authenticateJWT, authorizeRoles } from "../middlewares/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.put(
  "/:userId/role",
  authenticateJWT,
  authorizeRoles("Admin"),
  updateUserRole
);

export default router;
