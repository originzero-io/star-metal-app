import express from "express";
import db from "../../dbConnection.js";
import Sequelize from "sequelize";

const router = express.Router();

router.get("/", async (req, res) => {
  const ambalajlar = await db.query("SELECT * FROM Ambalajlar");
  //   const ambalajlar = await db.query("SELECT * FROM Ambalajlar", {
  //     type: Sequelize.QueryTypes.SELECT,
  //   });
  res.send(ambalajlar);
});

router.post("/", async (req, res) => {});
router.put("/", async (req, res) => {});
router.delete("/", async (req, res) => {});

export default router;
