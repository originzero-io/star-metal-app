import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const butonlar = await db.query("SELECT * FROM Butonlar");
  res.send(butonlar);
});

export default router;
