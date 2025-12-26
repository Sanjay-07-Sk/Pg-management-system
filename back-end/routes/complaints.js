import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET all complaints
 * URL: /api/complaints
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT complaints.*, tenants.name
       FROM complaints
       JOIN tenants ON complaints.tenant_id = tenants.id
       ORDER BY complaints.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADD new complaint
 * URL: /api/complaints
 */
router.post("/", async (req, res) => {
  try {
    const { tenant_id, issue } = req.body;

    await pool.query(
      "INSERT INTO complaints (tenant_id, issue) VALUES ($1, $2)",
      [tenant_id, issue]
    );

    res.json({ message: "Complaint submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE complaint status
 * URL: /api/complaints/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await pool.query(
      "UPDATE complaints SET status = $1 WHERE id = $2",
      [status, req.params.id]
    );

    res.json({ message: "Complaint status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE complaint
 * URL: /api/complaints/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM complaints WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
