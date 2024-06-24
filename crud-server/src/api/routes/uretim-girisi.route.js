import express from "express";
import asyncHandler from "express-async-handler";
import Referans from "../models/referans.model.js";
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
        },
      ],
      where: {
        sevkTarihi: null, // sevk edilmemiş kayıtları filtrele (sevk edilmişse sevk tarihi doludur)
      },
      order: [["referansNo", "ASC"]],
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
  "/:id",
  asyncHandler(async (req, res) => {
    const uretimGirisleri = await UretimGirisi.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar", // Sadece bu alanlar
        },
      ],
      where: {
        uretimSiraNo: req.params.id,
      },
      order: [["id", "ASC"]],
    });

    const uretimIdsiBazliUretimGirisleri = uretimGirisleri.reduce((acc, item) => {
      if (!acc[item.uretimSiraNo]) {
        acc[item.uretimSiraNo] = [];
      }
      acc[item.uretimSiraNo].push(item);
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
      const uretim = await DFasonUretim.findByPk(req.body.uretimSiraNo);
      if (uretim) {
        const updatedUretim = await uretim.update({
          uretilenMiktar: uretim.uretilenMiktar + req.body.uretimAdedi,
        });

        res.json(updatedUretim);
      } else {
        res.status(400).send("üretim girişi bulunamadı");
      }
    } else {
      const uretim = await DNormalUretim.findByPk(req.body.uretimSiraNo);

      if (uretim) {
        const updatedUretim = await uretim.update({
          uretilenMiktar: uretim.uretilenMiktar + req.body.uretimAdedi,
          uretilmeyenMiktar: uretim.uretilmeyenMiktar - req.body.uretimAdedi,
        });

        res.json(updatedUretim);
      } else {
        res.status(400).send("üretim girişi bulunamadı");
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

    res.send("aktiflik değişti");
  }),
);

router.put(
  "/sevkiyat-bilgilerini-doldur",
  asyncHandler(async (req, res) => {
    const { kayitlar } = req.body;

    kayitlar.forEach(async (kayit) => {
      const uretimGirisiIdleri = kayit.uretimGirisiIdleri.split(",").map(Number);

      const sonuc = await UretimGirisi.update(
        {
          sevkTarihi: kayit.sevkTarihi,
          personel: kayit.personel,
          sofor: `${kayit.sofor.adi} ${kayit.sofor.soyadi}`,
          plaka: kayit.plaka,
          irsaliyeNo: kayit.irsaliyeNo,
        },
        {
          where: {
            id: uretimGirisiIdleri,
          },
        },
      );

      // üretim giden kalan kayıtlarını güncelle;
      const updatedUretim = await uretimGidenVeKalanMiktarlariGuncelle(kayit);

      console.log(`Güncellenen kayıt sayısı: ${sonuc[0]}, üretim kayıtları: ${updatedUretim}`);
    });

    res.send("Tüm kayıtlar başarıyla sevk edildi.");
  }),
);

const uretimGidenVeKalanMiktarlariGuncelle = async (kayit) => {
  if (kayit.Referanslar.fasonFirmasi) {
    const fasonUretim = await DFasonUretim.findByPk(kayit.uretimSiraNo);

    if (fasonUretim) {
      const updatedUretim = await DFasonUretim.update({
        sevkEdilenMiktar: DFasonUretim.sevkEdilenMiktar + kayit.uretimAdedi,
      });

      return updatedUretim;
    } else {
      return null;
    }
  } else {
    const normalUretim = await DNormalUretim.findByPk(kayit.uretimSiraNo);

    if (normalUretim) {
      const updatedUretim = await DNormalUretim.update({
        gidenMiktar: DNormalUretim.gidenMiktar + kayit.uretimAdedi,
        kalanMiktar: DNormalUretim.kalanMiktar - kayit.uretimAdedi,
      });

      return updatedUretim;
    } else {
      return null;
    }
  }
};

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    for (const row of selectedRows) {
      await UretimGirisi.destroy({
        where: { id: row.id },
      });
      await uretimKaydiniDuzenle(row);
    }
    res.send("işlem başarılı");
  }),
);

const uretimKaydiniDuzenle = async (row) => {
  if (row.Referanslar.fason) {
    const uretim = await DFasonUretim.findByPk(row.uretimSiraNo);
    if (uretim) {
      await uretim.update({
        uretilenMiktar: uretim.uretilenMiktar - row.uretimAdedi,
      });
    } else {
      console.log("böyle bir fason üretim bulunamadı");
    }
  } else {
    const uretim = await DNormalUretim.findByPk(row.uretimSiraNo);

    if (uretim) {
      await uretim.update({
        uretilenMiktar: uretim.uretilenMiktar - row.uretimAdedi,
        uretilmeyenMiktar: uretim.uretilmeyenMiktar + row.uretimAdedi,
      });
    } else {
      console.log("böyle bir normal üretim bulunamadı");
    }
  }
};

export default router;
