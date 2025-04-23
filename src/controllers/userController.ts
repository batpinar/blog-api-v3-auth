import { Request, Response } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../models/userModel.js';
import { updateUserSchema, registerSchema } from '../validations/auth.user.validation.js';
import { number } from 'zod';

export const listUser = async (req: Request, res: Response) => {
  try {
    const { showDeleted } = req.query;
    const dbData = await getAllUsers(showDeleted as string);
    res.json(dbData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'An error occurred' });
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const dbData = await getUserById(Number(id));
    if (dbData) {
      res.json(dbData);
    } else {
      res.status(404).json({ message: 'not_found' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'An error occurred' });
  }
}

export const addUser  = async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const parsedInput = registerSchema.parse(input);
    const newData = await createUser(parsedInput, { id: 1, role: 'ADMIN' }); // Assuming currentUser is passed as { id: 1, role: 'ADMIN' }
    res.status(202).json(newData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'An error occurred' });
  }
}

export const editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const input = req.body;
    const parsedInput = updateUserSchema.parse(input);
    const updateData = await updateUser(Number(id), parsedInput, { id: 1, role: 'ADMIN' }); // Assuming currentUser is passed as { id: 1, role: 'ADMIN' }
    res.json(updateData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'An error occurred' });
  }
}

export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleteData = await deleteUser(Number(id), { id: 1, role: 'ADMIN' }); // Assuming currentUser is passed as { id: 1, role: 'ADMIN' }
    res.json(deleteData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'An error occurred' });
  }
}