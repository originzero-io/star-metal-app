/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import express from "express";
import asyncHandler from "express-async-handler";
import Referans, { ReferansUretim } from "../models/referans.model.js";
import UretimGirisi from "../models/uretim-girisi.model.js";
import UretimGirisiHelper from "../../utils/uretim-girisleri.helper.js";

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
        referansNo: req.params.referansNo,
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
    await UretimGirisi.create(req.body);

    const guncellenenUretim = await UretimGirisiHelper.uretimMiktarlariniGuncelle(req.body);

    if (guncellenenUretim) {
      res.json(guncellenenUretim);
    } else res.status(400).send("Üretim girişi bulunamadı", req.body.id);
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

      const kayitSayisi = await UretimGirisi.update(
        {
          sevkTarihi: kayit.sevkTarihi,
          personel: kayit.personel,
          sofor: `${kayit.sofor.adi} ${kayit.sofor.soyadi}`,
          plaka: kayit.plaka,
          irsaliyeNo: logoIrsaliyeNo,
          aciklama: `${kayit.genelAciklama1  } ${  kayit.genelAciklama2  } ${ kayit.genelAciklama3}`,
        },
        {
          where: {
            id: uretimGirisiIdleri,
            referansNo: kayit.referansNo, // aynı id'ye sahip fason kayıt da olabilmesine karşı referansNo şartı da eklendi
          },
        },
      );

      console.log(`>> ${kayitSayisi} << adet üretim girişi güncellendi`);

      await UretimGirisiHelper.gidenVeKalanMiktarlariGuncelle(kayit);

      console.log(`Güncellenen kayıt sayısı: ${kayitSayisi[0]}`);
      return kayitSayisi;
    });

    await Promise.all(updatePromises);

    res.send("Tüm kayıtlar başarıyla sevk edildi.");
  }),
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    const deletePromises = selectedRows.map(async (row) => {
      await UretimGirisi.destroy({
        where: { id: row.id },
      });
      await UretimGirisiHelper.uretimMiktarlariniGeriAl(row);
    });

    await Promise.all(deletePromises);

    res.send("Üretim girişi silindi, üretim miktarları geri alındı.");
  }),
);

export default router;
