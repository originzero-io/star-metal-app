import express from "express";
import multer from "multer";
import Referans, { ReferansIslemTipi, ReferansParcaAdi } from "../models/referans.model.js";
import { NormalUretim } from "../models/uretim.model.js";
import fs from "fs";
import { findDirname } from "../../utils/file.js";

const referansResimMiddleware = multer({
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, file, cb) => {
    cb(undefined, true);
  },
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      // 1111-VB.png
      cb(null, `${req.body.referansNo}.${file.mimetype.split("/")[1]}`);
    },
    destination: (req, file, cb) => {
      cb(null, `${findDirname(import.meta.url)}/../uploads/referanslar`);
    },
  }),
});

const router = express.Router();

router.get("/", async (req, res) => {
  const referanslar = await Referans.findAll();

  res.send(referanslar);
});

router.post("/", referansResimMiddleware.single("photo"), async (req, res) => {
  const { referansNo } = req.body;

  const resimUrl = `${referansNo}.${req.file.mimetype.split("/")[1]}`;

  try {
    console.log("ref:", { ...req.body, resimUrl });
    const newReferans = await Referans.create({ ...req.body, resimUrl });
    res.json(newReferans);
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const referans = await Referans.findByPk(req.body.id);
    const currentReferansNo = referans.referansNo;
    if (referans) {
      const updatedReferans = await referans.update(req.body);

      if (updatedReferans) {
        await NormalUretim.update(
          {
            referansNo: updatedReferans.referansNo,
            islemAciklama: updatedReferans.islemAciklama,
            siparisNo: updatedReferans.siparisNo,
          }, // Güncellenecek yeni değerler
          { where: { referansNo: currentReferansNo } }, // eski değer
        );
      }
      res.status(200).json(updatedReferans);
    } else {
      res.status(400).send("referans bulunamadı");
    }
  } catch (error) {
    console.log("error: ", error.errors[0].path);
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});

router.delete("/", async (req, res) => {
  const { selectedRows } = req.body;

  try {
    selectedRows.forEach(async (row) => {
      const filePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${row.resimUrl}`;
      await Referans.destroy({
        where: { id: row.id },
      });
      fs.unlinkSync(filePath);
    });
    res.send("Kayıtlar silindi");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/islem-tipi", async (req, res) => {
  const referansIslemTipleri = await ReferansIslemTipi.findAll();
  res.json(referansIslemTipleri);
});

router.post("/islem-tipi", async (req, res) => {
  const { islemTipi } = req.body;
  try {
    const newIslemTipi = await ReferansIslemTipi.create({ islemTipi: islemTipi });
    res.json(newIslemTipi);
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});

router.get("/parca-adi", async (req, res) => {
  const referansParcaAdlari = await ReferansParcaAdi.findAll();
  res.json(referansParcaAdlari);
});

router.post("/parca-adi", async (req, res) => {
  const { parcaAdi } = req.body;
  try {
    const newParcaAdi = await ReferansParcaAdi.create({ parcaAdi: parcaAdi });
    res.json(newParcaAdi);
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});

export default router;
