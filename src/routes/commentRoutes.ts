import { Router } from "express";
import { addComment, editComment, getComment, listComments, removeComment } from "../controllers/commentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/', listComments);
router.get('/:id', getComment);
router.post('/', authenticate, addComment);
router.put('/:id', authenticate, editComment);
router.delete('/:id', authenticate, removeComment)

export default router;
