import express from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import multer from "multer";
import { findDirname } from "../../utils/file.js";
import Referans, { ReferansUretim } from "../models/referans.model.js";
import { DNormalUretim } from "../models/uretim.model.js";

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
    const referanslar = await Referans.findAll({
      include: [
        {
          model: ReferansUretim,
          required: false, // INNER JOIN, false ise LEFT JOIN olur
          as: "ReferansUretim",
        },
      ],
    });

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
    try {
      await Referans.destroy({
        truncate: true,
      });
      await Referans.bulkCreate(logodanGelenKayitlar);

      const newReferanslar = await Referans.findAll({
        include: [
          {
            model: ReferansUretim,
            required: false, // INNER JOIN, false ise LEFT JOIN olur
            as: "ReferansUretim",
          },
        ],
      });

      res.json(newReferanslar);
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
        await DNormalUretim.update(
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
      res.status(400).send("Referans bulunamadı", req.body.id);
    }
  }),
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    const deletePromises = selectedRows.map(async (row) => {
      await Referans.destroy({
        where: { id: row.id },
      });
      await ReferansUretim.destroy({
        where: { logoMalzemeRef: row.logoMalzemeRef },
      });

      // const filePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${row.ReferansUretim.resimUrl}`;
      // fs.unlink(filePath); // fs.unlinkSync yerine async/await kullanmak için fs.unlink kullanıyoruz
    });

    await Promise.all(deletePromises);

    res.send("Referans ve referans resmi silme işlemi başarılı.");
  }),
);

router.post(
  "/uretim-verileri",
  referansResimMiddleware.single("photo"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Resim yok" });
    }
    const referansUretimVerisi = req.body;

    const resimUrl = `${referansUretimVerisi.referansNo}.${req.file.mimetype.split("/")[1]}`;

    const newReferansUretim = await ReferansUretim.create({ ...referansUretimVerisi, resimUrl });

    res.status(201).json(newReferansUretim);
  }),
);

router.put(
  "/uretim-verileri",
  asyncHandler(async (req, res) => {
    const yeniVeri = req.body;

    const referansUretim = await ReferansUretim.findOne({ where: { logoMalzemeRef: yeniVeri.logoMalzemeRef } });

    if (referansUretim) {
      const updatedReferansUretim = await referansUretim.update(yeniVeri);
      res.json(updatedReferansUretim);
    } else {
      console.log("Böyle bir referans üretim verisi bulunamadı", yeniVeri.logoMalzemeRef);
      res.send("Böyle bir referans üretim verisi bulunamadı");
    }
  }),
);

export default router;
