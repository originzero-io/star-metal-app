import express from "express";
import { NormalUretim, FasonUretim } from "../models/uretim.model.js";
import Referans from "../models/referans.model.js";
import UretimGirisi from "../models/uretim-girisi.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const uretimGirisleri = await UretimGirisi.findAll({
    include: [
      {
        model: Referans,
        required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
        // attributes: ["musteriAdi", "fasonFirmasi", "islemTipi", "irsaliyeAciklamasi"], // Sadece bu alanlar
        as: "Referanslar",
      },
    ],
    where: {
      sevkTarihi: null, // sevk edilmemiş kayıtları filtrele (sevk edilmişse sevk tarihi doludur)
    },
    order: [["referansNo", "ASC"]],
  });

  const musteriBazliUretimGirisleri = uretimGirisleri.reduce((acc, uretim) => {
    const musteriAdi = uretim.Referanslar.musteriAdi;

    // Eğer bu müşteri adı ile bir grup zaten mevcut değilse, bu grup için boş bir dizi oluştur
    if (!acc[musteriAdi]) {
      acc[musteriAdi] = [];
    }
    acc[musteriAdi].push(uretim);

    return acc; // Akümülatörü (gruplama objesini) döndür
  }, {}); // İlk değer olarak boş bir obje kullanılır

  res.json(musteriBazliUretimGirisleri);
});

router.get("/:id", async (req, res) => {
  const uretimGirisleri = await UretimGirisi.findAll({
    include: [
      {
        model: Referans,
        required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
        //attributes: ["musteriAdi"], // Sadece bu alanlar
        as: "Referanslar", // Sadece bu alanlar
      },
    ],
    where: {
      uretimSiraNo: req.params.id,
    },
    order: [["id", "ASC"]],
  });

  const uretimIdsiBazliUretimGirisleri = uretimGirisleri.reduce((acc, item) => {
    // uretimSıraNo'ya göre gruplama
    if (!acc[item.uretimSiraNo]) {
      acc[item.uretimSiraNo] = [];
    }
    acc[item.uretimSiraNo].push(item);
    return acc;
  }, {});

  res.json(uretimIdsiBazliUretimGirisleri);
});

router.post("/", async (req, res) => {
  // const referenceAttributes = [
  //   "musteriAdi",
  //   "fasonFirmasi",
  //   "islemTipi",
  //   "irsaliyeAciklamasi",
  //   "cikisReferansNo",
  //   "siparisTipi",
  //   "siparisNo",
  //   "talepNo",
  //   "referansYuzeyAlani",
  // ];
  const { fason } = req.body;

  await UretimGirisi.create(req.body);

  if (fason) {
    const uretim = await FasonUretim.findByPk(req.body.uretimSiraNo);
    if (uretim) {
      const updatedUretim = await uretim.update({
        uretilenMiktar: uretim.uretilenMiktar + req.body.uretimAdedi,
        // uretilmeyenMiktar: uretim.uretilmeyenMiktar - req.body.uretimAdedi,
      });

      res.json(updatedUretim);
    } else {
      res.status(400).send("üretim girişi bulunamadı");
    }
  } else {
    const uretim = await NormalUretim.findByPk(req.body.uretimSiraNo);

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
});

router.put("/aktiflik-degistir", async (req, res) => {
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
    const uretimGirisiIds = kayitlar.flatMap((kayit) => kayit.uretimIdleri.split(",").map(Number));

    console.log("uretimGirisiIds", uretimGirisiIds);
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
});

router.put("/sevk-et", async (req, res) => {
  const { kayitlar } = req.body;
  // console.log("kayitlar", kayitlar);
  try {
    // Tüm kayıtlar üzerinde döngü
    kayitlar.forEach(async (kayit) => {
      const uretimIdleri = kayit.uretimIdleri.split(",").map(Number);
      console.log("uretimIdleri", uretimIdleri);
      // UretimGirisi modelindeki kayıtları bul ve güncelle
      const sonuc = await UretimGirisi.update(
        {
          sevkTarihi: kayit.sevkTarihi,
          personel: kayit.personel,
          sofor: kayit.sofor,
          irsaliyeNo: kayit.irsaliyeNo,
        },
        {
          where: {
            id: uretimIdleri,
          },
        },
      );

      console.log(`Güncellenen kayıt sayısı: ${sonuc[0]}`);
    });

    res.send("Tüm kayıtlar başarıyla güncellendi.");
  } catch (error) {
    console.error("Güncelleme işlemi sırasında bir hata oluştu:", error);
    res.status(500).send("Güncelleme işlemi sırasında bir hata oluştu.");
  }
  // res.send("selam");
});

router.delete("/", async (req, res) => {
  const { selectedRows } = req.body;

  // const promises = selectedRows.map(async (row) => {
  //   await UretimGirisi.destroy({
  //     where: { id: row.id },
  //   });
  //   await uretimKaydiniDuzenle(row);
  // });

  try {
    for (const row of selectedRows) {
      await UretimGirisi.destroy({
        where: { id: row.id },
      });
      await uretimKaydiniDuzenle(row);
    }
    console.log("BURASI ÇALIŞACAK");
    res.send("işlem başarılı");
  } catch (error) {
    res.status(500).send("Bir hata oluştu");
    console.error("Hata: ", error);
  }
  // try {
  //   await Promise.all(promises);
  //   console.log("BURASI ÇALIŞACAK");
  //   res.send("işlem başarılı");
  // } catch (error) {
  //   res.status(500).send("Bir hata oluştu");
  //   console.error("Hata: ", error);
  // }
});

const uretimKaydiniDuzenle = async (row) => {
  if (row.Referanslar.fason) {
    const uretim = await FasonUretim.findByPk(row.uretimSiraNo);
    if (uretim) {
      await uretim.update({
        uretilenMiktar: uretim.uretilenMiktar - row.uretimAdedi,
        // uretilmeyenMiktar: uretim.uretilmeyenMiktar + req.body.uretimAdedi,
      });
    } else {
      console.log("böyle bir fason üretim bulunamadı");
    }
  } else {
    const uretim = await NormalUretim.findByPk(row.uretimSiraNo);

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
