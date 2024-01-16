import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const referanslar = await db.query("SELECT * FROM Referanslar");
  res.send(referanslar);
});

router.post("/", async (req, res) => {
  const {
    referansNo,
    irsaliyeAciklama,
    partiAdedi,
    referansYuzeyAlani,
    siparisNo,
    islemAciklama,
    firmaAdi01,
    birim,
    firmaAdi02,
    islemTipi,
    uretimAdediDegistirme,
  } = req.body;

  try {
    await db.query(
      `INSERT INTO Referanslar (referansNo, irsaliyeAciklama, hesaplama, partiAdedi, referansYuzeyAlani, siparisNo, islemAciklama, firmaAdi01, birim, firmaAdi02, islemTipi, uretimAdediDegistirme) VALUES ('${referansNo}','${irsaliyeAciklama}', '0.0002', '${partiAdedi}', '${referansYuzeyAlani}', '${siparisNo}', '${islemAciklama}', '${firmaAdi01}', '${birim}', '${firmaAdi02}', '${islemTipi}', '${uretimAdediDegistirme}'  )`,
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
          hesaplama= '0.0002',
          partiAdedi= '${referans.partiAdedi}',
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
