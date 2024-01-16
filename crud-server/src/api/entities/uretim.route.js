import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/devam-eden", async (req, res) => {
  const uretimler = await db.query("SELECT * FROM Uretimler");
  res.send(uretimler);
});
router.get("/tamamlanan", async (req, res) => {
  const uretimler = await db.query("SELECT * FROM Uretimler");
  res.send(uretimler);
});

router.post("/", async (req, res) => {});
router.put("/", async (req, res) => {});
router.delete("/", async (req, res) => {});

export default router;
