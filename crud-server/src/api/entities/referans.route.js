import express from "express";
import db from "../../dbConnection.js";
import multer from "multer";

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
      cb(null, "api/uploads/referanslar");
    },
  }),
});

const router = express.Router();

router.get("/", async (req, res) => {
  const referanslar = await db.query("SELECT * FROM Referanslar");
  res.send(referanslar);
});

router.post("/", referansResimMiddleware.single("photo"), async (req, res) => {
  const {
    referansNo,
    irsaliyeAciklama,
    lotAdedi,
    miktarSapmasi,
    referansYuzeyAlani,
    siparisNo,
    islemAciklama,
    firmaAdi01,
    birim,
    firmaAdi02,
    islemTipi,
    uretimAdediDegistirme,
  } = req.body;

  const resimUrl = `${referansNo}.${req.file.mimetype.split("/")[1]}`;

  try {
    await db.query(
      `INSERT INTO Referanslar (referansNo, irsaliyeAciklama, lotAdedi, miktarSapmasi, referansYuzeyAlani, siparisNo, islemAciklama, firmaAdi01, birim, firmaAdi02, islemTipi, uretimAdediDegistirme, resimUrl) VALUES ('${referansNo}','${irsaliyeAciklama}', '${lotAdedi}', '${miktarSapmasi}', '${referansYuzeyAlani}', '${siparisNo}', '${islemAciklama}', '${firmaAdi01}', '${birim}', '${firmaAdi02}', '${islemTipi}', '${uretimAdediDegistirme}', '${resimUrl}'  )`,
    );
    res.send("Kayıt eklendi.");
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const referans = req.body;

    await db.query(
      `UPDATE Referanslar
        SET referansNo = '${referans.referansNo}',
          irsaliyeAciklama= '${referans.irsaliyeAciklama}',
          lotAdedi= '${referans.lotAdedi}',
          miktarSapmasi= '${referans.miktarSapmasi}',
          referansYuzeyAlani= '${referans.referansYuzeyAlani}',
          siparisNo= '${referans.siparisNo}',
          islemAciklama= '${referans.islemAciklama}',
          firmaAdi01= '${referans.firmaAdi01}',
          birim= '${referans.birim}',
          firmaAdi02= '${referans.firmaAdi02}',
          islemTipi= '${referans.islemTipi}',
          uretimAdediDegistirme= '${referans.uretimAdediDegistirme}'
        WHERE id = '${referans.id}';`,
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
    await db.query(`DELETE FROM Referanslar WHERE id IN (${row.id})`);
  });

  res.send("silme isteği alındı");
});

export default router;
