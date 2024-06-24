import express from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import multer from "multer";
import { findDirname } from "../../utils/file.js";
import Referans from "../models/referans.model.js";
import { NormalUretim } from "../models/uretim.model.js";

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

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const referanslar = await Referans.findAll();

    res.send(referanslar);
  }),
);

router.post(
  "/",
  referansResimMiddleware.single("photo"),
  asyncHandler(async (req, res) => {
    const { referansNo } = req.body;
    if (!req.file) {
      throw new Error("Referans resmi yüklemek zorunludur");
    }

    const resimUrl = `${referansNo}.${req.file.mimetype.split("/")[1]}`;

    console.log("ref:", { ...req.body, resimUrl });
    const newReferans = await Referans.create({ ...req.body, resimUrl });
    res.json(newReferans);
  }),
);

router.post(
  "/logo-ile-esle",
  asyncHandler(async (req, res) => {
    // mevcut tüm kayıtları sil yeni gelen listeyle doldur
    const logodanGelenKayitlar = req.body;
    console.log("logodanGelenKayitlar", logodanGelenKayitlar);

    try {
      await Referans.destroy({
        truncate: true,
      });
      const newIslemTipleri = await Referans.bulkCreate(logodanGelenKayitlar);

      res.json(newIslemTipleri);
    } catch (error) {
      console.log("error: ", error);
    }
  }),
);

router.put(
  "/",
  asyncHandler(async (req, res) => {
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
  }),
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    selectedRows.forEach(async (row) => {
      const filePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${row.resimUrl}`;
      await Referans.destroy({
        where: { id: row.id },
      });
      fs.unlinkSync(filePath);
    });

    res.send("ok");
  }),
);

export default router;
