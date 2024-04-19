import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // banyo koduna göre verileri çekebilirsin
  const banyolar = await db.query("SELECT * FROM Banyolar");
  res.send(banyolar);
});

export default router;
