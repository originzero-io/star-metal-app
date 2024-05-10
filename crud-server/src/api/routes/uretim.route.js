import express from "express";
import { NormalUretim, FasonUretim } from "../models/uretim.model.js";
import Referans from "../models/referans.model.js";
import Irsaliye from "../models/irsaliye.model.js";

const router = express.Router();

router.get("/devam-eden", async (req, res) => {
  const normalUretimler = await NormalUretim.findAll({
    include: [
      {
        model: Referans,
        required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
        as: "Referanslar",
      },
    ],
  });
  const fasonUretimler = await FasonUretim.findAll({
    include: [
      {
        model: Referans,
        required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
        as: "Referanslar",
      },
    ],
  });

  res.send({ normalUretimler, fasonUretimler });
});

router.get("/devam-eden/fason/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fasonUretim = await FasonUretim.findOne({
      where: { id: id },
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
        },
      ],
    });
    res.send(fasonUretim);
  } catch (error) {
    console.error("Fason üretim kaydı bulunamadı:", error);
    res.status(500).send("Bir hata oluştu.");
  }
});

router.post("/devam-eden", async (req, res) => {
  const malzemeler = req.body;

  const newMalzemeler = { normalUretimler: [], fasonUretimler: [] };

  const createPromises = malzemeler.map(async (malzeme) => {
    if (malzeme.fason) {
      const fasonUretimler = await FasonUretim.create({
        ...malzeme,
        sevkEdilenMiktar: malzeme.gidenMiktar,
      });
      newMalzemeler.fasonUretimler.push(fasonUretimler);
      return fasonUretimler;
    } else {
      const normalUretimler = await NormalUretim.create({
        ...malzeme,
      });
      newMalzemeler.normalUretimler.push(normalUretimler);
      return normalUretimler;
    }
  });

  await Promise.all(createPromises);
  res.json(newMalzemeler);
});

router.put("/devam-eden/gelen-malzeme-miktari", async (req, res) => {
  try {
    const { currentRecord, newData } = req.body;
    let uretim;
    if (currentRecord.Referanslar.fason) {
      uretim = await FasonUretim.findByPk(currentRecord.id);
      await uretim.update({
        gelenMiktar: newData.gelenMiktar,
        gidenMiktar: uretim.gidenMiktar === 0 ? 0 : newData.gelenMiktar,
      });
    } else {
      uretim = await NormalUretim.findByPk(currentRecord.id);
      await uretim.update({
        gelenMiktar: newData.gelenMiktar,
        kalanMiktar: newData.gelenMiktar - uretim.gidenMiktar,
        uretilmeyenMiktar: newData.gelenMiktar - uretim.uretilenMiktar,
      });
    }
    console.log("uretim", uretim);

    // newData, mevcut değerle aynı gelirse update hook u çalışmıyor. Bu durumun önüne geçmek için modeli reload yapıyoruz.
    await uretim.reload({ include: [{ model: Referans, as: "Referanslar" }] });

    res.json(uretim); // güncellenen ilk değer
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
      message: error.message,
    });
  }
});

router.put("/devam-eden/talepNo", async (req, res) => {
  try {
    const { currentRecord, newData } = req.body;
    let uretim;
    if (currentRecord.Referanslar.fason) {
      uretim = await FasonUretim.findByPk(currentRecord.id);
      await uretim.update({
        talepNo: newData.talepNo,
      });
    } else {
      uretim = await NormalUretim.findByPk(currentRecord.id);
      await uretim.update({
        talepNo: newData.talepNo,
      });
    }
    console.log("uretim", uretim);

    // newData, mevcut değerle aynı gelirse update hook u çalışmıyor. Bu durumun önüne geçmek için modeli reload yapıyoruz.
    await uretim.reload({ include: [{ model: Referans, as: "Referanslar" }] });

    res.json(uretim); // güncellenen ilk değer
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
      message: error.message,
    });
  }
});

router.put("/devam-eden/fasonlara-irsaliye-kes", async (req, res) => {
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

    //

    const requests = irsaliyeKaydi.map(async (item) => {
      const fasonUretim = await FasonUretim.findOne({ where: { id: item.id } });

      if (fasonUretim) {
        await fasonUretim.update({ gidenMiktar: item.gelenMiktar });
      } else {
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

router.delete("/devam-eden", async (req, res) => {});

router.get("/tamamlanan", async (req, res) => {
  res.send("tamamlanan üretimler");
});

router.post("/tamamlanan", async (req, res) => {
  res.send("aman");
});

export default router;
