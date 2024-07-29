/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import express from "express";
import asyncHandler from "express-async-handler";
import Referans, { ReferansUretim } from "../models/referans.model.js";
import UretimGirisi from "../models/uretim-girisi.model.js";
import { DFasonUretim, DNormalUretim } from "../models/uretim.model.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const uretimGirisleri = await UretimGirisi.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
          include: [
            {
              model: ReferansUretim,
              as: "ReferansUretim",
            },
          ],
        },
      ],
      where: {
        sevkTarihi: null, // sevk edilmemiş kayıtları filtrele (sevk edilmişse sevk tarihi doludur)
      },
      order: [["id", "ASC"]],
    });

    const musteriBazliUretimGirisleri = uretimGirisleri.reduce((acc, uretim) => {
      const { musteriAdi } = uretim.Referanslar;

      // Eğer bu müşteri adı ile bir grup zaten mevcut değilse, bu grup için boş bir dizi oluştur
      if (!acc[musteriAdi]) {
        acc[musteriAdi] = [];
      }
      acc[musteriAdi].push(uretim);

      return acc; // Akümülatörü (gruplama objesini) döndür
    }, {}); // İlk değer olarak boş bir obje kullanılır

    res.json(musteriBazliUretimGirisleri);
  }),
);

router.get(
  "/:id/:referansNo",
  asyncHandler(async (req, res) => {
    const uretimGirisleri = await UretimGirisi.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar", // Sadece bu alanlar
          include: [
            {
              model: ReferansUretim,
              as: "ReferansUretim",
            },
          ],
        },
      ],
      where: {
        uretimId: req.params.id,
        // referansNo: req.params.referansNo,
      },
      order: [["id", "ASC"]],
    });

    const uretimIdsiBazliUretimGirisleri = uretimGirisleri.reduce((acc, item) => {
      if (!acc[item.uretimId]) {
        acc[item.uretimId] = [];
      }
      acc[item.uretimId].push(item);
      return acc;
    }, {});

    res.json(uretimIdsiBazliUretimGirisleri);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { fason } = req.body;

    await UretimGirisi.create(req.body);

    if (fason) {
      const uretim = await DFasonUretim.findByPk(req.body.uretimId);
      if (uretim) {
        const updatedUretim = await uretim.update({
          uretilenMiktar: uretim.uretilenMiktar + req.body.uretimAdedi,
        });

        res.json(updatedUretim);
      } else {
        res.status(400).send("Üretim girişi bulunamadı", req.body.id);
      }
    } else {
      const uretim = await DNormalUretim.findByPk(req.body.uretimId);

      if (uretim) {
        const updatedUretim = await uretim.update({
          uretilenMiktar: uretim.uretilenMiktar + req.body.uretimAdedi,
          uretilmeyenMiktar: uretim.uretilmeyenMiktar - req.body.uretimAdedi,
        });

        res.json(updatedUretim);
      } else {
        res.status(400).send("Üretim girişi bulunamadı", req.body.id);
      }
    }
  }),
);

router.put(
  "/aktiflik-degistir",
  asyncHandler(async (req, res) => {
    const { istenenAktiflik, kayitlar } = req.body;

    if (istenenAktiflik === false) {
      const uretimGirisiIds = kayitlar.map((kayit) => kayit.id); // Gelen diziden id'leri al

      console.log("uretimGirisiIds", uretimGirisiIds);
      await UretimGirisi.update(
        { aktif: istenenAktiflik },
        {
          where: {
            id: uretimGirisiIds,
          },
        },
      );
    } else {
      // "1,2,3" şeklinde gönderilmiş id leri parçala ve sayıya çevir.
      const uretimGirisiIds = kayitlar.flatMap((kayit) => kayit.uretimGirisiIdleri.split(",").map(Number));

      await UretimGirisi.update(
        { aktif: istenenAktiflik },
        {
          where: {
            id: uretimGirisiIds,
          },
        },
      );
    }

    res.send("Kayıtların aktiflikleri başarıyla değiştirildi.");
  }),
);

router.put(
  "/sevkiyat-bilgilerini-doldur",
  asyncHandler(async (req, res) => {
    const { kayitlar, logoIrsaliyeNo } = req.body;

    const updatePromises = kayitlar.map(async (kayit) => {
      const uretimGirisiIdleri = kayit.uretimGirisiIdleri.split(",").map(Number);
      console.log("uretimGirisiIdleri", uretimGirisiIdleri);

      const sonuc = await UretimGirisi.update(
        {
          sevkTarihi: kayit.sevkTarihi,
          personel: kayit.personel,
          sofor: `${kayit.sofor.adi} ${kayit.sofor.soyadi}`,
          plaka: kayit.plaka,
          irsaliyeNo: logoIrsaliyeNo,
          aciklama: kayit.aciklama,
        },
        {
          where: {
            id: uretimGirisiIdleri,
          },
        },
      );

      console.log("güncellenen üretim girisleri: ", sonuc);

      // üretim giden kalan kayıtlarını güncelle
      const updatedUretim = await gidenVeKalanMiktarlariGuncelle(kayit);

      console.log(`Güncellenen kayıt sayısı: ${sonuc[0]}, üretim kayıtları: ${updatedUretim}`);
      return sonuc;
    });

    await Promise.all(updatePromises);

    res.send("Tüm kayıtlar başarıyla sevk edildi.");
  }),
);

const gidenVeKalanMiktarlariGuncelle = async (kayit) => {
  const uretimGirisiIdleri = kayit.uretimGirisiIdleri.split(",").map(Number);
  const uretimGirisiList = await UretimGirisi.findAll({ where: { id: uretimGirisiIdleri } });

  for (const uretimGirisi of uretimGirisiList) {
    if (kayit.Referanslar.fason) {
      const fasonUretim = await DFasonUretim.findOne({ where: { id: uretimGirisi.uretimId } });

      if (fasonUretim && !kayit.fasona) {
        // irsaliye fasona kesiliyorsa sevkEdilenMiktar değişmeyecek
        const updatedUretim = await fasonUretim.update({
          sevkEdilenMiktar: fasonUretim.sevkEdilenMiktar + uretimGirisi.uretimAdedi,
        });

        console.log("updatedUretim", updatedUretim);
      } else {
        console.log(`Fason Uretim ID ${uretimGirisi.uretimId} bulunamadı.`);
      }
    } else {
      const normalUretim = await DNormalUretim.findOne({ where: { id: uretimGirisi.uretimId } });

      if (normalUretim) {
        console.log("normalUretim", normalUretim.id);
        console.log("eklenecek adet", uretimGirisi.uretimAdedi);

        const updatedUretim = await normalUretim.update({
          gidenMiktar: normalUretim.gidenMiktar + uretimGirisi.uretimAdedi,
          kalanMiktar: normalUretim.kalanMiktar - uretimGirisi.uretimAdedi,
        });

        console.log("updatedUretim", updatedUretim);
      } else {
        console.log(`Uretim ID ${uretimGirisi.uretimId} bulunamadı.`);
      }
    }
  }

  return null;
};

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    const deletePromises = selectedRows.map(async (row) => {
      await UretimGirisi.destroy({
        where: { id: row.id },
      });
      await uretimMiktarlariniGeriAl(row);
    });

    await Promise.all(deletePromises);

    res.send("Üretim girişi silindi, üretim miktarları geri alındı.");
  }),
);

const uretimMiktarlariniGeriAl = async (row) => {
  if (row.Referanslar.fason) {
    const uretim = await DFasonUretim.findByPk(row.uretimId);
    if (uretim) {
      await uretim.update({
        uretilenMiktar: uretim.uretilenMiktar - row.uretimAdedi,
      });
    } else {
      console.log("Böyle bir fason üretim bulunamadı", row.id);
    }
  } else {
    const uretim = await DNormalUretim.findByPk(row.uretimId);

    if (uretim) {
      await uretim.update({
        uretilenMiktar: uretim.uretilenMiktar - row.uretimAdedi,
        uretilmeyenMiktar: uretim.uretilmeyenMiktar + row.uretimAdedi,
      });
    } else {
      console.log("Böyle bir normal üretim bulunamadı", row.id);
    }
  }
};

export default router;
