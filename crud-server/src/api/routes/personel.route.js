import express from "express";
import Personel from "../models/personel.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const personeller = await Personel.findAll();
  res.send(personeller);
});

router.post("/", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const newPersonel = await Personel.create(req.body);
    res.json(newPersonel);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});
router.put("/", async (req, res) => {
  try {
    const personel = await Personel.findByPk(req.body.id);
    if (personel) {
      const updatedPersonel = await personel.update(req.body);
      res.json(updatedPersonel);
    } else {
      res.status(400).send("personel bulunamadı");
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
    await Personel.destroy({
      where: { id: row.id },
    });
  });

  res.send("silme isteği alındı");
});

export default router;
