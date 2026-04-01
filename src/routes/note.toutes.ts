import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import * as noteController from "../controllers/note.controller";

const router = Router();

// All routes here require authentication
router.use(protect);

router.get("/", noteController.getNotes);
router.post("/", noteController.createNote);
router.delete("/:noteId", noteController.deleteNote);

export default router;