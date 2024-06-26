import express from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import multer from "multer";
import path from "path";
import { findDirname } from "../../utils/file.js";
import Ambalaj from "../models/ambalaj.model.js";

const ambalajResimMiddleware = multer({
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, file, cb) => {
    cb(undefined, true);
  },
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      // kutu01.png
      cb(null, `${req.body.kasaAdi}.${file.mimetype.split("/")[1]}`);
    },
    destination: (req, file, cb) => {
      cb(null, `${findDirname(import.meta.url)}/../uploads/ambalajlar`);
    },
  }),
});

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const ambalajlar = await Ambalaj.findAll();
    res.send(ambalajlar);
  }),
);

router.post(
  "/",
  ambalajResimMiddleware.single("photo"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Fotoğraf yok" });
    }

    const { kasaAdi } = req.body;
    const resimUrl = `${kasaAdi}.${req.file.mimetype.split("/")[1]}`;

    const newAmbalaj = await Ambalaj.create({ ...req.body, resimUrl });
    res.status(201).json(newAmbalaj);
  }),
);

router.put(
  "/",
  ambalajResimMiddleware.single("photo"),
  asyncHandler(async (req, res) => {
    const ambalaj = await Ambalaj.findByPk(req.body.id);
    if (ambalaj) {
      let { resimUrl } = ambalaj;

      if (req.file) {
        // Yeni resmi kaydet
        resimUrl = `${req.body.kasaAdi}.${req.file.mimetype.split("/")[1]}`;
        const newFilePath = `${findDirname(import.meta.url)}/../uploads/ambalajlar/${resimUrl}`;

        // Dosyayı yeni adla yeniden adlandır
        const currentFilePath = req.file.path;
        fs.renameSync(currentFilePath, newFilePath);
      } else {
        // Fotoğraf değişmemişse, mevcut adı yeni ada yeniden adlandır
        const oldFilePath = `${findDirname(import.meta.url)}/../uploads/ambalajlar/${ambalaj.resimUrl}`;
        const newFilePath = `${findDirname(import.meta.url)}/../uploads/ambalajlar/${req.body.kasaAdi}${path.extname(ambalaj.resimUrl)}`;
        if (oldFilePath !== newFilePath && fs.existsSync(oldFilePath)) {
          fs.renameSync(oldFilePath, newFilePath);
          resimUrl = `${req.body.kasaAdi}${path.extname(ambalaj.resimUrl)}`;
          console.log("resim yeniden adlandırıldı:", resimUrl);
        }
      }

      const updatedAmbalaj = await ambalaj.update({ ...req.body, resimUrl });
      res.json(updatedAmbalaj);
    } else {
      res.status(400).send("Ambalaj bulunamadı", req.body.id);
    }
  }),
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    selectedRows.forEach(async (row) => {
      const filePath = `${findDirname(import.meta.url)}/../uploads/ambalajlar/${row.resimUrl}`;
      await Ambalaj.destroy({
        where: { id: row.id },
      });
      fs.unlinkSync(filePath);
    });
    res.status(200).send("Kayıtlar silindi");
  }),
);

export default router;
