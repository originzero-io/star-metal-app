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
    console.error("Fason üretim kayıtlarını güncellerken bir hata oluştu:", error);
    res.status(500).send("Bir hata oluştu.");
  }
});

router.post("/devam-eden", async (req, res) => {
  const malzemeler = req.body;

  const newMalzemeler = { normalUretimler: [], fasonUretimler: [] };

  const createPromises = malzemeler.map(async (malzeme) => {
    if (malzeme.fason) {
      const fasonUretimler = await FasonUretim.create({
        irsaliyeNo: malzeme.irsaliyeNo,
        getirenSofor: malzeme.getirenSofor,
        personel: malzeme.personel,
        fasonFirmasi: malzeme.fasonFirmasi,
        referansNo: malzeme.referansNo,
        iade: malzeme.iade,
        gelenTarih: malzeme.gelenTarih,
        birinciAmbalaj: malzeme.birinciAmbalaj,
        ikinciAmbalaj: malzeme.ikinciAmbalaj,
        gelenMiktar: malzeme.gelenMiktar,
        gidenMiktar: malzeme.gidenMiktar,
        uretilenMiktar: malzeme.uretilenMiktar,
        sevkEdilenMiktar: malzeme.gidenMiktar,
      });
      newMalzemeler.fasonUretimler.push(fasonUretimler);
      return fasonUretimler;
    } else {
      const normalUretimler = await NormalUretim.create({
        irsaliyeNo: malzeme.irsaliyeNo,
        getirenSofor: malzeme.getirenSofor,
        personel: malzeme.personel,
        referansNo: malzeme.referansNo,
        iade: malzeme.iade, // ? bu true false da yapılabilir
        gelenTarih: malzeme.gelenTarih,
        birinciAmbalaj: malzeme.birinciAmbalaj,
        ikinciAmbalaj: malzeme.ikinciAmbalaj,
        gelenMiktar: malzeme.gelenMiktar,
        gidenMiktar: malzeme.gidenMiktar,
        kalanMiktar: malzeme.kalanMiktar,
        uretilenMiktar: malzeme.uretilenMiktar,
        uretilmeyenMiktar: malzeme.uretilmeyenMiktar,
      });
      newMalzemeler.normalUretimler.push(normalUretimler);
      return normalUretimler;
    }
  });

  await Promise.all(createPromises);
  res.json(newMalzemeler);
});

router.put("/devam-eden", async (req, res) => {
  console.log(req.body);
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
    res.json(uretim); // güncellenen ilk değer
  } catch (error) {
    res.status(500).json({
      name: error.name,
      fields: error.fields,
      message: error.message,
    });
  }
  // try {
  //   const { currentRecord, newData } = req.body;
  //   let updatedUretim;
  //   if (currentRecord.Referanslar.fason) {
  //     updatedUretim = await FasonUretim.update(
  //       newData, // Güncellenecek yeni değerler
  //       { where: { id: currentRecord.id }, returning: true, individualHooks: true },
  //     );
  //   } else {
  //     updatedUretim = await NormalUretim.update(
  //       newData, // Güncellenecek yeni değerler
  //       { where: { id: currentRecord.id }, returning: true, individualHooks: true },
  //     );
  //   }
  //   res.json(updatedUretim[1][0]); // güncellenen ilk değer
  // } catch (error) {
  //   console.log("error: ", error);
  //   res.status(500).json({
  //     name: error.name,
  //     fields: error.fields,
  //   });
  // }
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

router.delete("/devam-eden", async (req, res) => {});

router.get("/tamamlanan", async (req, res) => {
  res.send("tamamlanan üretimler");
});

router.post("/tamamlanan", async (req, res) => {
  console.log("body:", req.body);
  res.send("aman");
});

export default router;
