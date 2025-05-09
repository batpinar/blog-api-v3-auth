import { Request, Response } from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../models/categoryModel.js";
import { UserRole } from "@prisma/client";
import { checkUserRole } from "../utils/userRoleCheck.js";

export const listCategories = async (req: Request, res: Response) => {
    try {
        const { showDeleted } = req.query;
        const dbData = await getAllCategories(showDeleted as string);
        res.json(dbData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const getCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const dbData = await getCategoryById(Number(id));
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

export const addCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = checkUserRole(req, res);
        if (!userRole) {
            res.status(403).json({ message: "Yetkisiz işlem" });
            return;
        }
        const newData = await createCategory(req.body, userRole) 
        res.status(202).json(newData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const editCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const userRole = checkUserRole(req, res);
        if (!userRole) {
            res.status(403).json({ message: "Yetkisiz işlem" });
            return;
        }
        const updateData = await updateCategory(Number(id), req.body, userRole) // Assuming currentUser is passed as { id: 1, role: 'ADMIN' }
        res.json(updateData)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const removeCategory = async (req: Request, res: Response) : Promise<void> => {
    const { id } = req.params
    try {
        const userRole = checkUserRole(req, res);
        if (!userRole) {
             res.status(403).json({ message: "Yetkisiz işlem" });
             return;
        }
        const deleteData = await deleteCategory(Number(id), userRole); // Assuming currentUser is passed as { id: 1, role: 'ADMIN' }
        res.json(deleteData)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}