import { Request, Response } from "express";
import { AuthRequest } from "../types/global";
import Task from "../model/Task";

export const get_tasks = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;

  try {
    const tasks = await Task.findAll({ where: { userId }});
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: (err as Error)?.message || 'An error has occurred' });
  }
};

export const post_tasks = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { title } = req.body;

  try {
    const task = await Task.create({ title, userId });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: (err as Error)?.message || 'An error has occurred' });
  }
};

export const put_tasks = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { title, completed } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);
    if (!task || task.userId !== Number(userId)) {
      res.status(404).json({ message: "Task not found or not authorized" });
      return;
    }
    if (typeof completed === 'boolean') {
      await task.update({ completed });
    }
    if (typeof title === 'string') {
      await task.update({ title });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: (err as Error)?.message || "Internal server error" });
  }
};

export const delete_tasks = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  const { id } = req.params;
  
  try {
    const task = await Task.findByPk(id);
    if (!task || task.userId !== Number(userId)) {
      res.status(404).json({ message: "Task not found or not authorized" });
      return;
    }
    await task.destroy();
    res.status(204).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: (err as Error)?.message || "Internal server error" });
  }
};
