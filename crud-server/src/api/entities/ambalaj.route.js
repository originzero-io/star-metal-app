import express from "express";
import db from "../../dbConnection.js";
import multer from "multer";
import fs from "fs";
import path from "path";

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
      cb(null, "api/uploads/ambalajlar");
    },
  }),
});

const router = express.Router();

router.get("/", async (req, res) => {
  const ambalajlar = await db.query("SELECT * FROM Ambalajlar");
  res.send(ambalajlar);
});

router.post("/", ambalajResimMiddleware.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Fotoğraf yok" });
  }

  const { kasaAdi } = req.body;

  const resimUrl = `${kasaAdi}.${req.file.mimetype.split("/")[1]}`;

  try {
    await db.query(
      `INSERT INTO Ambalajlar (kasaAdi, resimUrl) VALUES ('${kasaAdi}', '${resimUrl}')`,
    );
    res.status(201).json({ success: true, message: "Kayıt eklendi" });
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});
router.put("/", async (req, res) => {
  try {
    const ambalaj = req.body;

    await db.query(
      `UPDATE Ambalajlar
        SET kasaAdi = '${ambalaj.kasaAdi}'
        WHERE id = '${ambalaj.id}'`,
    );
    res.status(200).send("güncelleme başarılı");
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});
router.delete("/", async (req, res) => {
  const { selectedRows } = req.body;

  selectedRows.forEach(async (row) => {
    const filePath = path.join("api/uploads/ambalajlar", row.resimUrl);

    try {
      await db.query(`DELETE FROM Ambalajlar WHERE id IN (${row.id})`);
      fs.unlinkSync(filePath);
      res.status(200).send("Ambalaj silindi");
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
});

export default router;
