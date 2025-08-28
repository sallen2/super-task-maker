"use client";

import { useEffect, useState } from "react";
import type { Task } from "@repo/types";
import { pino } from "pino";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";
import styles from "./page.module.css";

const logger = pino({ name: "web", browser: { asObject: true } }).child({ page: "tasks" });

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        logger.info("Fetching tasks from API");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
        const tasks = await response.json();
        setTasks(tasks);
        logger.info({ taskCount: tasks.length }, "Tasks fetched successfully");
      } catch (error) {
        logger.error({ err: error }, "Error fetching tasks");
      }
    };

    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    logger.info({ taskId: newTask.id, title: newTask.title }, "Task added to local state");
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Tasks</h1>
        <div className={styles.formSection}>
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>
        <div className={styles.tasksList}>
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}