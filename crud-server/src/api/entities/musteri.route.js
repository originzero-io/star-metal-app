import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const musteriler = await db.query("SELECT * FROM Musteriler");
  res.send(musteriler);
});

router.post("/", async (req, res) => {
  const { musteriAdi1, musteriAdi2, adres1, adres2, il, ilce, vergiDairesi, vergiHesapNo } =
    req.body;

  try {
    await db.query(
      `INSERT INTO Musteriler (musteriAdi1, musteriAdi2, adres1, adres2, il, ilce, vergiDairesi, vergiHesapNo) VALUES ('${musteriAdi1}','${musteriAdi2}', '${adres1}', '${adres2}', '${il}', '${ilce}', '${vergiDairesi}', '${vergiHesapNo}' )`,
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
    const musteri = req.body;
    console.log("musteriii: ", musteri);
    await db.query(
      `UPDATE Musteriler
        SET musteriAdi1 = '${musteri.musteriAdi1}',
          musteriAdi2= '${musteri.musteriAdi2}',
          adres1= '${musteri.adres1}',
          adres2= '${musteri.adres2}',
          il= '${musteri.il}',
          ilce= '${musteri.ilce}',
          vergiDairesi= '${musteri.vergiDairesi}',
          vergiHesapNo= '${musteri.vergiHesapNo}'
        WHERE id = '${musteri.id}';`,
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
    await db.query(`DELETE FROM Musteriler WHERE id IN (${row.id})`);
  });

  res.send("silme isteği alındı");
});

export default router;
