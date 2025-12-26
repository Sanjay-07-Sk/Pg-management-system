import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET all rent records
 * URL: /api/rent
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rent.*, tenants.name, tenants.phone
       FROM rent
       JOIN tenants ON rent.tenant_id = tenants.id
       ORDER BY rent.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET rent by tenant
 * URL: /api/rent/tenant/:tenantId
 */
router.get("/tenant/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;

    const result = await pool.query(
      `SELECT * FROM rent
       WHERE tenant_id = $1
       ORDER BY id DESC`,
      [tenantId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADD monthly rent
 * URL: /api/rent
 */
router.post("/", async (req, res) => {
  try {
    const { tenant_id, amount, month } = req.body;

    await pool.query(
      `INSERT INTO rent (tenant_id, amount, month)
       VALUES ($1, $2, $3)`,
      [tenant_id, amount, month]
    );

    res.json({ message: "Rent record added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * MARK rent as paid
 * URL: /api/rent/:id
 */
router.put("/:id", async (req, res) => {
  try {
    await pool.query(
      "UPDATE rent SET paid = true WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Rent marked as paid" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE rent record
 * URL: /api/rent/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM rent WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Rent record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
