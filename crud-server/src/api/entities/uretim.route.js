import express from "express";
import db from "../../dbConnection.js";
import DevamEdenUretim from "./models/uretim.model.js";
import Referans from "./models/referans.model.js";

const router = express.Router();

router.get("/devam-eden", async (req, res) => {
  const uretimler = await DevamEdenUretim.findAll({
    include: [
      {
        model: Referans,
        required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
        attributes: ["islemTipi", "resimUrl", "referansYuzeyAlani"], // Sadece bu alanlar
      },
    ],
  });
  res.send(uretimler);
});
router.get("/tamamlanan", async (req, res) => {
  const uretimler = await db.query("SELECT * FROM Uretimler");
  res.send(uretimler);
});

router.post("/devam-eden", async (req, res) => {
  const newMalzemeler = await DevamEdenUretim.bulkCreate(req.body);
  res.json(newMalzemeler);
});

router.post("/tamamlanan", async (req, res) => {
  console.log("body:", req.body);
  res.send("aman");
});
router.put("/", async (req, res) => {});
router.delete("/", async (req, res) => {});

export default router;
