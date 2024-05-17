import express from "express";
import Musteri from "../models/musteri.model.js";
import asyncHandler from "express-async-handler";

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
