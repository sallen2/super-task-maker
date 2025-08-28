"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Super Task Manager</h1>
        <p className={styles.description}>
          Organize your tasks and boost your productivity
        </p>
        <Link href="/tasks" className={styles.button}>
          Get Started
        </Link>
      </main>
    </div>
  );
}
