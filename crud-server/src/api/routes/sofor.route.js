import express from "express";
import Sofor from "../models/sofor.model.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const soforler = await Sofor.findAll();
    res.send(soforler);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const newSofor = await Sofor.create(req.body);
      res.json(newSofor);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        name: error.name,
        fields: error.fields,
      });
    }
  }),
);

router.post(
  "/logo-ile-esle",
  asyncHandler(async (req, res) => {
    // mevcut tüm kayıtları sil yeni gelen listeyle doldur
    const logodanGelenKayitlar = req.body;
    try {
      await Sofor.destroy({
        truncate: true,
      });
      const newSoforler = await Sofor.bulkCreate(logodanGelenKayitlar);
      res.json(newSoforler);
    } catch (error) {
      console.log("error", error);
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
      const sofor = await Sofor.findByPk(req.body.id);
      if (sofor) {
        const updatedSofor = await sofor.update(req.body);
        res.json(updatedSofor);
      } else {
        res.status(400).send("şoför bulunamadı");
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
      await Sofor.destroy({
        where: { id: row.id },
      });
    });

    res.send("silme isteği alındı");
  }),
);

export default router;
