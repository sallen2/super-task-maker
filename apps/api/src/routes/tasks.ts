import { Router } from "express";
import type { Task, CreateTaskRequest } from "@repo/types";
import { pino } from "pino";

const router = Router();
const logger = pino({ name: "api" }).child({ module: "tasks" });

const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Setup project repository",
    description:
      "Initialize the task manager project with proper folder structure and dependencies",
    completed: true,
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T14:30:00Z"),
  },
];

router.get("/", (_req, res) => {
  logger.info({ taskCount: dummyTasks.length }, "Fetching all tasks");
  res.json(dummyTasks);
});

router.post("/", (req, res) => {
  const { title, description }: CreateTaskRequest = req.body;

  if (!title || !title.trim()) {
    logger.warn({ body: req.body }, "Task creation failed - missing title");
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask: Task = {
    id: (dummyTasks.length + 1).toString(),
    title: title.trim(),
    description: description?.trim(),
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  dummyTasks.push(newTask);
  logger.info(
    {
      taskId: newTask.id,
      title: newTask.title,
      hasDescription: !!newTask.description,
    },
    "Task created successfully"
  );
  res.status(201).json(newTask);
});

export default router;
