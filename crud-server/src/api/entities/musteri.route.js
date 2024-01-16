import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const musteriler = await db.query("SELECT * FROM Musteriler");
  res.send(musteriler);
});

router.post("/", async (req, res) => {});
router.put("/", async (req, res) => {});
router.delete("/", async (req, res) => {});

export default router;
