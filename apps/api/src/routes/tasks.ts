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
  {
    id: "2",
    title: "Design database schema",
    description:
      "Create tables for users, tasks, and relationships between them",
    completed: true,
    createdAt: new Date("2024-01-16T09:15:00Z"),
    updatedAt: new Date("2024-01-16T16:45:00Z"),
  },
  {
    id: "3",
    title: "Implement user authentication",
    description: "Add login, signup, and JWT token management",
    completed: false,
    createdAt: new Date("2024-01-17T08:30:00Z"),
    updatedAt: new Date("2024-01-17T08:30:00Z"),
  },
  {
    id: "4",
    title: "Create task CRUD operations",
    completed: false,
    createdAt: new Date("2024-01-18T11:00:00Z"),
    updatedAt: new Date("2024-01-18T11:00:00Z"),
  },
  {
    id: "5",
    title: "Write unit tests",
    description: "Add comprehensive test coverage for all API endpoints",
    completed: false,
    createdAt: new Date("2024-01-19T13:20:00Z"),
    updatedAt: new Date("2024-01-19T15:10:00Z"),
  },
  {
    id: "6",
    title: "Deploy to production",
    description:
      "Setup CI/CD pipeline and deploy the application to cloud infrastructure",
    completed: false,
    createdAt: new Date("2024-01-20T07:45:00Z"),
    updatedAt: new Date("2024-01-20T07:45:00Z"),
  },
  {
    id: "7",
    title: "Update documentation",
    description: "Create API documentation and user guides",
    completed: true,
    createdAt: new Date("2024-01-14T16:00:00Z"),
    updatedAt: new Date("2024-01-21T12:00:00Z"),
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
