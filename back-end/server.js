import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import rooms from "./routes/rooms.js";
import tenants from "./routes/tenants.js";
import rent from "./routes/rent.js";
import complaints from "./routes/complaints.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/rooms", rooms);
app.use("/api/tenants", tenants);
app.use("/api/rent", rent);
app.use("/api/complaints", complaints);

app.get("/api/test", (req, res) => {
  res.json({ message: "API Working ✅" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
