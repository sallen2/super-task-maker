import request from "supertest";
import express from "express";
import healthRouter from "./health";

const app = express();
app.use("/health", healthRouter);

describe("Health API", () => {
  describe("GET /health", () => {
    it("should return health status with ok", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status");
      expect(response.body.status).toBe("ok");
    });

    it("should return current timestamp", async () => {
      const beforeRequest = new Date().toISOString();

      const response = await request(app).get("/health").expect(200);

      const afterRequest = new Date().toISOString();

      expect(response.body).toHaveProperty("timestamp");
      expect(typeof response.body.timestamp).toBe("string");

      // Check if timestamp is between before and after request
      const responseTime = new Date(response.body.timestamp);
      expect(responseTime.getTime()).toBeGreaterThanOrEqual(
        new Date(beforeRequest).getTime()
      );
      expect(responseTime.getTime()).toBeLessThanOrEqual(
        new Date(afterRequest).getTime()
      );
    });

    it("should return valid ISO timestamp format", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );

      // Should be parseable as valid date
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toString()).not.toBe("Invalid Date");
    });

    it("should return JSON content type", async () => {
      const response = await request(app)
        .get("/health")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toBeInstanceOf(Object);
    });

    it("should have consistent response structure", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(Object.keys(response.body)).toEqual(["status", "timestamp"]);
      expect(Object.keys(response.body)).toHaveLength(2);
    });
  });
});
