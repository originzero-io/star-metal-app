import express from "express";
import multer from "multer";
import fs from "fs";
import Ambalaj from "../models/ambalaj.model.js";
import { findDirname } from "../../utils/file.js";
import asyncHandler from "express-async-handler";

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

    try {
      const newAmbalaj = await Ambalaj.create({ ...req.body, resimUrl });
      res.status(201).json(newAmbalaj);
    } catch (error) {
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
      const ambalaj = await Ambalaj.findByPk(req.body.id);
      if (ambalaj) {
        const updatedAmbalaj = await ambalaj.update(req.body);
        res.json(updatedAmbalaj);
      } else {
        res.status(400).send("ambalaj bulunamadı");
      }
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({
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

    try {
      selectedRows.forEach(async (row) => {
        const filePath = `${findDirname(import.meta.url)}/../uploads/ambalajlar/${row.resimUrl}`;
        await Ambalaj.destroy({
          where: { id: row.id },
        });
        fs.unlinkSync(filePath);
      });
      res.status(200).send("Kayıtlar silindi");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }),
);

export default router;
