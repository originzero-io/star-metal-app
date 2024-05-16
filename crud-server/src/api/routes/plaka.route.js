import express from "express";
import Plaka from "../models/plaka.model.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const plakalar = await Plaka.findAll();
    res.send(plakalar);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const newPlaka = await Plaka.create(req.body);
    res.json(newPlaka);
  }),
);

router.post(
  "/logo-ile-esle",
  asyncHandler(async (req, res) => {
    // mevcut tüm kayıtları sil yeni gelen listeyle doldur
    const logodanGelenKayitlar = req.body;
    await Plaka.destroy({
      truncate: true,
    });
    const newPlakalar = await Plaka.bulkCreate(logodanGelenKayitlar);
    res.json(newPlakalar);
  }),
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const plaka = await Plaka.findByPk(req.body.id);
    if (plaka) {
      const updatedPlaka = await plaka.update(req.body);
      res.json(updatedPlaka);
    } else {
      res.status(400).send("plaka bulunamadı");
    }
  }),
);
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    selectedRows.forEach(async (row) => {
      await Plaka.destroy({
        where: { id: row.id },
      });
    });

    res.send("silme isteği alındı");
  }),
);

export default router;
