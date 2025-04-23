import { Router } from "express";
import { addUser, editUser, getUser, listUser, removeUser } from "../controllers/userController.js";
const router = Router();

router.get('/', listUser);
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', editUser);
router.delete('/:id', removeUser)

export default router;
