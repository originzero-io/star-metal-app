import express from "express";
import db from "../../dbConnection.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const ambalajlar = await db.query("SELECT * FROM Ambalajlar");
  res.send(ambalajlar);
});

router.post("/", async (req, res) => {
  const { kasaAdi } = req.body;

  try {
    await db.query(`INSERT INTO Ambalajlar (kasaAdi) VALUES ('${kasaAdi}')`);
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
    await db.query(`DELETE FROM Ambalajlar WHERE id IN (${row.id})`);
  });

  res.send("silme isteği alındı");
});

export default router;
