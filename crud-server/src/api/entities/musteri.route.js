import express from "express";
import Musteri from "./models/musteri.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const musteriler = await Musteri.findAll();
  res.send(musteriler);
});

router.post("/", async (req, res) => {
  try {
    const newMusteri = await Musteri.create(req.body);
    res.json(newMusteri);
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});
router.put("/", async (req, res) => {
  try {
    const musteri = await Musteri.findByPk(req.body.id);
    if (musteri) {
      const updatedMusteri = await musteri.update(req.body);
      res.json(updatedMusteri);
    } else {
      res.status(400).send("müşteri bulunamadı");
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
    await Musteri.destroy({
      where: { id: row.id },
    });
  });

  res.send("silme isteği alındı");
});

export default router;
