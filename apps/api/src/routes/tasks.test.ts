import request from "supertest";
import express from "express";
import tasksRouter from "./tasks";
import type { Task, CreateTaskRequest } from "@repo/types";

const app = express();
app.use(express.json());
app.use("/tasks", tasksRouter);

describe("Tasks API", () => {
  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const response = await request(app).get("/tasks").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const firstTask = response.body[0];
      expect(firstTask).toHaveProperty("id");
      expect(firstTask).toHaveProperty("title");
      expect(firstTask).toHaveProperty("completed");
      expect(firstTask).toHaveProperty("createdAt");
      expect(firstTask).toHaveProperty("updatedAt");
    });

    it("should return tasks with correct structure", async () => {
      const response = await request(app).get("/tasks").expect(200);

      response.body.forEach((task: Task) => {
        expect(typeof task.id).toBe("string");
        expect(typeof task.title).toBe("string");
        expect(typeof task.completed).toBe("boolean");
        expect(task.createdAt).toBeDefined();
        expect(task.updatedAt).toBeDefined();

        if (task.description) {
          expect(typeof task.description).toBe("string");
        }
      });
    });

    it("should return tasks with some completed and some incomplete", async () => {
      const response = await request(app).get("/tasks").expect(200);

      const completedTasks = response.body.filter(
        (task: Task) => task.completed
      );
      const incompleteTasks = response.body.filter(
        (task: Task) => !task.completed
      );

      expect(completedTasks.length).toBeGreaterThan(0);
      expect(incompleteTasks.length).toBeGreaterThan(0);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task with title only", async () => {
      const newTask: CreateTaskRequest = {
        title: "Test Task",
      };

      const response = await request(app)
        .post("/tasks")
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Test Task");
      expect(response.body.completed).toBe(false);
      expect(response.body.description).toBeUndefined();
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("should create a new task with title and description", async () => {
      const newTask: CreateTaskRequest = {
        title: "Test Task with Description",
        description: "This is a test description",
      };

      const response = await request(app)
        .post("/tasks")
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Test Task with Description");
      expect(response.body.description).toBe("This is a test description");
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("should return 400 when title is missing", async () => {
      const invalidTask = {
        description: "Task without title",
      };

      const response = await request(app)
        .post("/tasks")
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Title is required");
    });

    it("should return 400 when title is empty string", async () => {
      const invalidTask: CreateTaskRequest = {
        title: "",
        description: "Task with empty title",
      };

      const response = await request(app)
        .post("/tasks")
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Title is required");
    });

    it("should trim whitespace from title and description", async () => {
      const newTask: CreateTaskRequest = {
        title: "  Test Task with Spaces  ",
        description: "  Test description with spaces  ",
      };

      const response = await request(app)
        .post("/tasks")
        .send(newTask)
        .expect(201);

      expect(response.body.title).toBe("Test Task with Spaces");
      expect(response.body.description).toBe("Test description with spaces");
    });
  });
});
