import type { Task } from "@repo/types";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>No tasks yet. Add your first task above!</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {tasks.map((task) => (
        <div key={task.id} className={styles.taskItem}>
          <h3 className={styles.title}>{task.title}</h3>
          {task.description && <p className={styles.description}>{task.description}</p>}
          <div className={styles.meta}>
            <span className={styles.date}>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            <span className={`${styles.status} ${task.completed ? styles.statusCompleted : styles.statusPending}`}>
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}