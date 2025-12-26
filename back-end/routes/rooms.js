import express from "express";
import pool from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM rooms");
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { room_number, capacity } = req.body;
  await pool.query(
    "INSERT INTO rooms (room_number, capacity) VALUES ($1, $2)",
    [room_number, capacity]
  );
  res.json({ message: "Room added" });
});

export default router;
