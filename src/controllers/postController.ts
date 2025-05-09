import { Request, Response } from "express";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "../models/postModel.js";
import { createPostTag, deletePostTag } from "../models/postTagModel.js";



export const listPosts = async (req: Request, res: Response) => {
    try {
        const { showDeleted, status, category, tags } = req.query
        const dbData = await getAllPosts(showDeleted as string, status as string, Number(category), tags as string);
        res.json(dbData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const getPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const dbData = await getPostById(Number(id));
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

export const addPost = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            console.log("Kullanıcı:", req.user);
             res.status(401).json({ message: "Unauthorized!!!" });
             return;
        }
        const newData = await createPost(req.body, req.user);
        res.status(202).json(newData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const editPost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        if (!req.user) {
             res.status(401).json({ message: "Unauthorized" });
             return;
        }
        const updateData = await updatePost(Number(id), req.body, req.user);
        res.json(updateData)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const removePost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        if (!req.user) {
             res.status(401).json({ message: "Unauthorized" });
             return;
        }
        const deleteData = await deletePost(Number(id, ), req.user);
        res.json(deleteData)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const addPostTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tag_id } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
       }
        const newPostTag = await createPostTag(Number(id), Number(tag_id), req.user);
        res.status(201).json(newPostTag);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}

export const removePostTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tag_id } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
       }
        const deletedPostTag = await deletePostTag(Number(id), Number(tag_id), req.user);
        res.status(200).json(deletedPostTag);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bir hata oldu" })
    }
}