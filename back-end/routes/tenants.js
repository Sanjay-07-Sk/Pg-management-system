import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET all tenants
 * URL: /api/tenants
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tenants.*, rooms.room_number
       FROM tenants
       LEFT JOIN rooms ON tenants.room_id = rooms.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADD new tenant
 * URL: /api/tenants
 */
router.post("/", async (req, res) => {
  try {
    const { name, phone, room_id } = req.body;

    await pool.query(
      "INSERT INTO tenants (name, phone, room_id) VALUES ($1, $2, $3)",
      [name, phone, room_id]
    );

    // Mark room as unavailable
    await pool.query(
      "UPDATE rooms SET available = false WHERE id = $1",
      [room_id]
    );

    res.json({ message: "Tenant added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE tenant
 * URL: /api/tenants/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const tenantId = req.params.id;

    // Free the room
    const tenant = await pool.query(
      "SELECT room_id FROM tenants WHERE id = $1",
      [tenantId]
    );

    if (tenant.rows.length > 0) {
      await pool.query(
        "UPDATE rooms SET available = true WHERE id = $1",
        [tenant.rows[0].room_id]
      );
    }

    await pool.query("DELETE FROM tenants WHERE id = $1", [tenantId]);

    res.json({ message: "Tenant removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
