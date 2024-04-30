import express from "express";
import Plaka from "../models/plaka.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const plakalar = await Plaka.findAll();
  res.send(plakalar);
});

router.post("/", async (req, res) => {
  try {
    const newPlaka = await Plaka.create(req.body);
    res.json(newPlaka);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});
router.put("/", async (req, res) => {
  try {
    const plaka = await Plaka.findByPk(req.body.id);
    if (plaka) {
      const updatedPlaka = await plaka.update(req.body);
      res.json(updatedPlaka);
    } else {
      res.status(400).send("plaka bulunamadı");
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      name: error.name,
      fields: error.fields,
    });
  }
});
router.delete("/", async (req, res) => {
  const { selectedRows } = req.body;

  selectedRows.forEach(async (row) => {
    await Plaka.destroy({
      where: { id: row.id },
    });
  });

  res.send("silme isteği alındı");
});

export default router;
