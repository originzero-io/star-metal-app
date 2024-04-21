import express from "express";
import Irsaliye from "../models/irsaliye.model.js";
import Referans from "../models/referans.model.js";
import { FasonUretim } from "../models/uretim.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const irsaliyeler = await Irsaliye.findAll({
    include: [
      {
        model: Referans,
        required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
        attributes: ["irsaliyeAciklamasi", "musteriAdi", "fasonFirmasi"], // Sadece bu alanlar
      },
    ],
  });
  res.send(irsaliyeler);
});

router.post("/", async (req, res) => {
  try {
    const idsizIrsaliyeler = req.body.map(({ id, ...kayit }) => kayit);
    await Irsaliye.bulkCreate(idsizIrsaliyeler);

    const butunIrsaliyeler = await Irsaliye.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          attributes: ["irsaliyeAciklamasi", "musteriAdi", "fasonFirmasi"], // Sadece bu alanlar
        },
      ],
    });
    res.json(butunIrsaliyeler);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      name: error.name,
      fields: error.fields,
    });
  }
});

router.post("/fasona", async (req, res) => {
  const irsaliyeKaydi = req.body;

  const idsizİrsaliyeler = irsaliyeKaydi.map(({ id, ...kayit }) => kayit);
  try {
    await Irsaliye.bulkCreate(idsizİrsaliyeler);

    const butunIrsaliyeler = await Irsaliye.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          attributes: ["irsaliyeAciklamasi", "musteriAdi", "fasonFirmasi"], // Sadece bu alanlar
        },
      ],
    });

    const requests = irsaliyeKaydi.map(async (item) => {
      // const fasonUretim = await FasonUretim.findOne({ where: { referansNo: item.referansNo } });
      const fasonUretim = await FasonUretim.findOne({ where: { id: item.id } });

      if (fasonUretim) {
        // Kayıt varsa, gidenMiktar'ı gelenMiktar ile güncelle
        await fasonUretim.update({ gidenMiktar: item.gelenMiktar });
      } else {
        // İlgili referansNo'ya ait kayıt yoksa, bir hata mesajı gönder
        console.log(`ReferansNo ${item.referansNo} için kayıt bulunamadı.`);
      }
    });
    await Promise.all(requests);

    res.json(butunIrsaliyeler);
  } catch (error) {
    console.error("Fason üretim kayıtlarını güncellerken bir hata oluştu:", error);
    res.status(500).send("Bir hata oluştu.");
  }
});

router.delete("/", async (req, res) => {
  const { selectedRows } = req.body;

  selectedRows.forEach(async (row) => {
    await Irsaliye.destroy({
      where: { id: row.id },
    });
    if (row.fasona) {
      await fasonKaydiniSifirla(row);
    }
  });

  res.send("silme isteği alındı");
});

const fasonKaydiniSifirla = async (row) => {
  const uretim = await FasonUretim.findByPk(Number(row.uretimGirisiIdleri));
  if (uretim) {
    await uretim.update({
      gidenMiktar: 0,
    });
  } else {
    console.log("böyle bir fason üretim bulunamadı");
  }
};

export default router;
