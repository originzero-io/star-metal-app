import express from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import multer from "multer";
import { findDirname } from "../../utils/file.js";
import Referans, { ReferansIslemTipi, ReferansParcaAdi } from "../models/referans.model.js";
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

    const resimUrl = `${referansNo}.${req.file.mimetype.split("/")[1]}`;

    console.log("ref:", { ...req.body, resimUrl });
    const newReferans = await Referans.create({ ...req.body, resimUrl });
    res.json(newReferans);
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
  }),
);

router.get(
  "/islem-tipi",
  asyncHandler(async (req, res) => {
    const referansIslemTipleri = await ReferansIslemTipi.findAll();
    res.json(referansIslemTipleri);
  }),
);

router.post(
  "/islem-tipi",
  asyncHandler(async (req, res) => {
    const { islemTipi } = req.body;
    const newIslemTipi = await ReferansIslemTipi.create({ islemTipi });
    res.json(newIslemTipi);
  }),
);

router.put(
  "/islem-tipi",
  asyncHandler(async (req, res) => {
    const { mevcutIslemTipi, yeniIslemTipi } = req.body;

    const [affectedRows] = await ReferansIslemTipi.update(
      { islemTipi: yeniIslemTipi },
      {
        where: {
          islemTipi: mevcutIslemTipi,
        },
      },
    );
    res.json(affectedRows);
  }),
);

router.delete(
  "/islem-tipi",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    await ReferansIslemTipi.destroy({
      where: { islemTipi: selectedRows[0] },
    });
    res.send("ok");
  }),
);

router.get(
  "/parca-adi",
  asyncHandler(async (req, res) => {
    const referansParcaAdlari = await ReferansParcaAdi.findAll();
    res.json(referansParcaAdlari);
  }),
);

router.post(
  "/parca-adi",
  asyncHandler(async (req, res) => {
    const { parcaAdi } = req.body;
    const newParcaAdi = await ReferansParcaAdi.create({ parcaAdi });
    res.json(newParcaAdi);
  }),
);

router.put(
  "/parca-adi",
  asyncHandler(async (req, res) => {
    const { mevcutParcaAdi, yeniParcaAdi } = req.body;

    const [affectedRows] = await ReferansParcaAdi.update(
      { parcaAdi: yeniParcaAdi },
      {
        where: {
          parcaAdi: mevcutParcaAdi,
        },
      },
    );
    res.json(affectedRows);
  }),
);

router.delete(
  "/parca-adi",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    await ReferansParcaAdi.destroy({
      where: { parcaAdi: selectedRows[0] },
    });
    res.send("ok");
  }),
);

export default router;
