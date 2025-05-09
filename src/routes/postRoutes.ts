import { Router } from "express";
import { addPost, editPost, getPost, listPosts, removePost, addPostTag, removePostTag } from "../controllers/postController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const router = Router();

router.get('/', listPosts);
router.get('/:id', getPost);
router.post('/', authenticate, addPost);
router.put('/:id',authenticate, editPost);
router.delete('/:id', authenticate, removePost);
router.post('/:id/tags', authenticate, addPostTag);
router.delete('/:id/tags',authenticate, removePostTag);

export default router;
