import { Request, Response } from "express";
import { getAllTags, getTagById, createTag, updateTag, deleteTag } from "../models/tagModel.js";
import { checkUserRole } from "../utils/userRoleCheck.js";


export const listTags = async (req: Request, res: Response) => {
    try {
        const dbData = await getAllTags();
        res.json(dbData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const getTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const dbData = await getTagById(Number(id));
        if (dbData) {
            res.json(dbData);
        } else {
            res.status(404).json({ message: "not_found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const addTag = async (req: Request, res: Response) => {
    try {
        const userRole = checkUserRole(req, res);
        console.log("Kullanıcı:", req.user);

        if (!userRole) {
            res.status(403).json({ message: "Yetkisiz işlem" });
            return;
        }
        const newData = await createTag(req.body, userRole);
        res.status(202).json(newData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const editTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const userRole = checkUserRole(req, res);
        if (!userRole) {
            res.status(403).json({ message: "Yetkisiz işlem" });
            return;
        }
        const updateData = await updateTag(Number(id), req.body, userRole) // Assuming currentUser is passed as { id: 1, role: 'ADMIN' }
        res.json(updateData)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const removeTag = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const userRole = checkUserRole(req, res);
        if (!userRole) {
            res.status(403).json({ message: "Yetkisiz işlem" });
            return;
        }
        const deleteData = await deleteTag(Number(id), userRole); // Assuming currentUser is passed as { id: 1, role: 'ADMIN' }
        res.json(deleteData)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}