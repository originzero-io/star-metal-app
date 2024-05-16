import express from "express";
import Personel from "../models/personel.model.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const personeller = await Personel.findAll();
    res.send(personeller);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const newPersonel = await Personel.create(req.body);
      res.json(newPersonel);
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({
        name: error.name,
        fields: error.fields,
      });
    }
  }),
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
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
  }),
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    selectedRows.forEach(async (row) => {
      await Personel.destroy({
        where: { id: row.id },
      });
    });

    res.send("silme isteği alındı");
  }),
);

router.post(
  "/giris",
  asyncHandler(async (req, res) => {
    const { ad, parola } = req.body;
    try {
      const personel = await Personel.findOne({
        where: {
          ad,
          parola,
        },
      });

      if (personel) {
        res.send(personel);
      } else {
        res.send(null);
      }
    } catch (error) {
      console.error("Giriş işleminde hata: ", error);
      res.status(500).send({ message: "Sunucu hatası." });
    }
  }),
);

export default router;
