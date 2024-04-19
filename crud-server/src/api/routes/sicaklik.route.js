import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sicakliklar = await db.query("SELECT * FROM Sicakliklar");
  res.send(sicakliklar);
});
export default router;
