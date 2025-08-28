import express from "express";
import cors from "cors";
import { pino } from "pino";
import tasksRouter from "./routes/tasks.js";
import healthRouter from "./routes/health.js";

const app = express();
const PORT = process.env.PORT || 3002;
const logger = pino({ name: "api" });

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Super Task Manager API" });
});

app.use("/health", healthRouter);
app.use("/tasks", tasksRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response
  ) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.listen(PORT, () => {
  logger.info({ port: PORT }, `Server running on port ${PORT}`);
});

export default app;
