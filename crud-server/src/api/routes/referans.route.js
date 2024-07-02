import express from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import multer from "multer";
import path from "path";
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

const referansUretimVerileriniEsle = async (logodanGelenKayitlar) => {
  await ReferansUretim.destroy({
    truncate: true,
  });
  const data = logodanGelenKayitlar.map((kayit) => ({
    ...kayit,
    miktarSapmasi: 5,
    lotAdedi: 150,
    referansYuzeyAlani: 1.5,
  }));
  await ReferansUretim.bulkCreate(data);
};

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

      // await referansUretimVerileriniEsle(logodanGelenKayitlar);

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
        where: { logoMalzemeRef: row.logoMalzemeRef },
      });
      await ReferansUretim.destroy({
        where: { logoMalzemeRef: row.logoMalzemeRef },
      });

      const filePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${row.ReferansUretim?.resimUrl}`;

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Resmi silerken hata oluştu: ${filePath}`, err);
          } else {
            console.log(`Referans resmi silindi: ${filePath}`);
          }
        });
      } else console.log("Bu referansa ait kayıtlı bir resim yoktu.");
    });

    await Promise.all(deletePromises);

    res.send("Referans, referans üretim verileri ve referans resmi silme işlemi başarılı.");
  }),
);

router.get(
  "/uretim-verileri/:logoMalzemeRef",
  asyncHandler(async (req, res) => {
    const { logoMalzemeRef } = req.params;

    const referansUretim = await ReferansUretim.findOne({ where: { logoMalzemeRef } });

    res.status(201).json(referansUretim);
  }),
);

router.post(
  "/uretim-verileri",
  referansResimMiddleware.single("photo"),
  asyncHandler(async (req, res) => {
    const referansUretimVerisi = req.body;

    let resimUrl;
    if (req.file) {
      resimUrl = `${referansUretimVerisi.referansNo}.${req.file.mimetype.split("/")[1]}`;
    }

    const newReferansUretim = await ReferansUretim.create({ ...referansUretimVerisi, resimUrl });

    res.status(201).json(newReferansUretim);
  }),
);

// router.put(
//   "/uretim-verileri",
//   referansResimMiddleware.single("photo"),
//   asyncHandler(async (req, res) => {
//     const yeniVeri = req.body;

//     const yeniReferansUretim = JSON.parse(yeniVeri.ReferansUretim);
//     console.log(yeniReferansUretim);

//     let { resimUrl } = yeniReferansUretim;

//     const referansUretim = await ReferansUretim.findOne({ where: { logoMalzemeRef: yeniVeri.logoMalzemeRef } });

//     if (referansUretim) {
//       if (req.file) {
//         // Yeni resmi kaydet
//         resimUrl = `${yeniVeri.referansNo}.${req.file.mimetype.split("/")[1]}`;
//         const newFilePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${resimUrl}`;

//         // Dosyayı yeni adla yeniden adlandır
//         const currentFilePath = req.file.path;
//         fs.renameSync(currentFilePath, newFilePath);
//       } else {
//         console.log("BURADAYIIIM");

//         // Fotoğraf değişmemişse, mevcut adı yeni ada yeniden adlandır
//         const oldFilePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${referansUretim.resimUrl}`;
//         const newFilePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${yeniVeri.referansNo}${path.extname(referansUretim.resimUrl)}`;
//         console.log("oldFilePath", fs.existsSync(oldFilePath));

//         if (oldFilePath !== newFilePath && fs.existsSync(oldFilePath)) {
//           console.log("buraya da girdim");

//           fs.renameSync(oldFilePath, newFilePath);
//           resimUrl = `${req.body.kasaAdi}${path.extname(referansUretim.resimUrl)}`;
//           console.log("resim yeniden adlandırıldı:", resimUrl);
//         }
//       }

//       const updatedReferansUretim = await referansUretim.update({ ...yeniVeri, resimUrl });
//       res.json(updatedReferansUretim);
//     } else {
//       console.log("Böyle bir referans üretim verisi bulunamadı", yeniVeri.logoMalzemeRef);
//       res.send("Böyle bir referans üretim verisi bulunamadı");
//     }
//   }),
// );

router.put(
  "/uretim-verileri",
  referansResimMiddleware.single("photo"),
  asyncHandler(async (req, res) => {
    const yeniVeri = req.body;

    const yeniReferansUretim = JSON.parse(yeniVeri.ReferansUretim);
    console.log(yeniReferansUretim);

    let { resimUrl } = yeniReferansUretim;

    const referansUretim = await ReferansUretim.findOne({ where: { logoMalzemeRef: yeniVeri.logoMalzemeRef } });

    if (referansUretim) {
      if (req.file) {
        // Yeni resmi kaydet
        resimUrl = `${yeniVeri.referansNo}.${req.file.mimetype.split("/")[1]}`;
        const newFilePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${resimUrl}`;

        // Dosyayı yeni adla yeniden adlandır
        const currentFilePath = req.file.path;
        fs.renameSync(currentFilePath, newFilePath);
      } else if (referansUretim.resimUrl !== "") {
        // Fotoğraf değişmemişse ve mevcut bir resim varsa, mevcut adı yeni ada yeniden adlandır
        const oldFilePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${referansUretim.resimUrl}`;
        const newFilePath = `${findDirname(import.meta.url)}/../uploads/referanslar/${yeniVeri.referansNo}${path.extname(referansUretim.resimUrl)}`;

        if (oldFilePath !== newFilePath && fs.existsSync(oldFilePath)) {
          fs.renameSync(oldFilePath, newFilePath);
          resimUrl = `${yeniVeri.referansNo}${path.extname(referansUretim.resimUrl)}`;
          console.log("resim yeniden adlandırıldı:", resimUrl);
        }
      }

      const updatedReferansUretim = await referansUretim.update({ ...yeniVeri, resimUrl });
      res.json(updatedReferansUretim);
    } else {
      console.log("Böyle bir referans üretim verisi bulunamadı", yeniVeri.logoMalzemeRef);
      res.status(404).send("Böyle bir referans üretim verisi bulunamadı");
    }
  }),
);

export default router;
