import express from "express";
import asyncHandler from "express-async-handler";
import Musteri from "../models/musteri.model.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const musteriler = await Musteri.findAll();
    res.send(musteriler);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newMusteri = await Musteri.create(req.body);
    res.json(newMusteri);
  }),
);

router.post(
  "/logo-ile-esle",
  asyncHandler(async (req, res) => {
    // mevcut tüm kayıtları sil yeni gelen listeyle doldur
    const logodanGelenKayitlar = req.body;

    await Musteri.destroy({
      truncate: true,
    });
    const newMusteriler = await Musteri.bulkCreate(logodanGelenKayitlar);
    res.json(newMusteriler);
  }),
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const musteri = await Musteri.findByPk(req.body.id);
    if (musteri) {
      const updatedMusteri = await musteri.update(req.body);
      res.json(updatedMusteri);
    } else {
      res.status(400).send("müşteri bulunamadı");
    }
  }),
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    selectedRows.forEach(async (row) => {
      await Musteri.destroy({
        where: { id: row.id },
      });
    });

    res.send("silme isteği alındı");
  }),
);

export default router;
