/* eslint-disable no-restricted-syntax */
import express from "express";
import asyncHandler from "express-async-handler";
import Irsaliye from "../models/irsaliye.model.js";
import Referans, { ReferansUretim } from "../models/referans.model.js";
import UretimGirisi from "../models/uretim-girisi.model.js";
import { DFasonUretim, DNormalUretim, TFasonUretim, TNormalUretim } from "../models/uretim.model.js";

const router = express.Router();

router.get(
  "/devam-eden",
  asyncHandler(async (req, res) => {
    const normalUretimler = await DNormalUretim.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
          include: [
            {
              model: ReferansUretim,
              required: false,
              as: "ReferansUretim",
            },
          ],
        },
      ],
      order: [
        ["acil", "DESC"],
        ["id", "ASC"],
      ],
    });
    const fasonUretimler = await DFasonUretim.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
          include: [
            {
              model: ReferansUretim,
              required: false,
              as: "ReferansUretim",
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.send({ normalUretimler, fasonUretimler });
  }),
);

router.get(
  "/devam-eden/fason/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const fasonUretim = await DFasonUretim.findOne({
      where: { id },
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
    });
    res.send(fasonUretim);
  }),
);

router.post(
  "/devam-eden",
  asyncHandler(async (req, res) => {
    const malzemeler = req.body;

    const newMalzemeler = { normalUretimler: [], fasonUretimler: [] };

    const createPromises = malzemeler.map(async (malzeme) => {
      if (malzeme.fason) {
        const fasonUretimler = await DFasonUretim.create({
          ...malzeme,
          sevkEdilenMiktar: malzeme.gidenMiktar,
        });
        newMalzemeler.fasonUretimler.push(fasonUretimler);
        return fasonUretimler;
      }
      const normalUretimler = await DNormalUretim.create({
        ...malzeme,
      });
      newMalzemeler.normalUretimler.push(normalUretimler);
      return normalUretimler;
    });

    await Promise.all(createPromises);
    res.json(newMalzemeler);
  }),
);

router.put(
  "/devam-eden/gelen-malzeme-miktari",
  asyncHandler(async (req, res) => {
    const { currentRecord, newData } = req.body;
    let uretim;

    if (currentRecord.Referanslar.fason) {
      uretim = await DFasonUretim.findByPk(currentRecord.id);
      await uretim.update({
        gelenMiktar: newData.gelenMiktar,
        gidenMiktar: uretim.gidenMiktar === 0 ? 0 : newData.gelenMiktar,
      });
    } else {
      uretim = await DNormalUretim.findByPk(currentRecord.id);
      await uretim.update({
        gelenMiktar: newData.gelenMiktar,
        kalanMiktar: newData.gelenMiktar - uretim.gidenMiktar,
        uretilmeyenMiktar: newData.gelenMiktar - uretim.uretilenMiktar,
      });
    }

    // newData, mevcut değerle aynı gelirse update hook u çalışmıyor. Bu durumun önüne geçmek için modeli reload yapıyoruz.
    await uretim.reload({
      include: [
        {
          model: Referans,
          as: "Referanslar",
          include: [
            {
              model: ReferansUretim,
              as: "ReferansUretim",
            },
          ],
        },
      ],
    });

    res.json(uretim);
  }),
);

router.put(
  "/devam-eden/oncelik-ayarla",
  asyncHandler(async (req, res) => {
    const { currentRecord, newOncelikDurumu } = req.body;

    const uretim = await DNormalUretim.findByPk(currentRecord.id);
    await uretim.update({
      acil: newOncelikDurumu,
    });

    res.json(uretim);
  }),
);

router.delete(
  "/devam-eden",
  asyncHandler(async (req, res) => {
    const { kayit } = req.body;
    if (kayit.Referanslar.fason) {
      await DFasonUretim.destroy({
        where: { id: kayit.id },
      });
    } else {
      await DNormalUretim.destroy({
        where: { id: kayit.id },
      });
    }

    await UretimGirisi.destroy({
      where: { uretimId: kayit.id },
    });
    await Irsaliye.destroy({
      where: { uretimId: kayit.id },
    });

    res.send("ok");
  }),
);

router.get(
  "/tamamlanan",
  asyncHandler(async (req, res) => {
    const normalUretimler = await TNormalUretim.findAll({ order: [["id", "ASC"]] });
    const fasonUretimler = await TFasonUretim.findAll({ order: [["id", "ASC"]] });

    res.send({ normalUretimler, fasonUretimler });
  }),
);

// router.post(
//   "/tamamlanan",
//   asyncHandler(async (req, res) => {
//     const kayitlar = req.body;
//     const model = { 1: DFasonUretim, 0: DNormalUretim };

//     console.log("kayitlar", kayitlar);

//     // Tüm asenkron işlemleri bir diziye topla
//     const promises = kayitlar.map(async (kayit) => {
//       const uretimIdleri = kayit.uretimId.split(",").map(Number);

//       const { fason } = kayit.Referanslar;
//       const { uretimId } = kayit;

//       try {
//         const uretimList = await model[fason].findAll({
//           where: { id: uretimIdleri },
//           include: [
//             {
//               model: Referans,
//               as: "Referanslar",
//             },
//           ],
//         });

//         for (const uretim of uretimList) {
//           const kodVar = !uretim.Referanslar.kodu.toLowerCase().includes("yok");

//           if (fason) {
//             console.log("burdaıym");

//             if (uretim.gelenMiktar === uretim.sevkEdilenMiktar && kodVar) {
//               await uretimiTamamlananlaraGonder(uretim);
//             }
//           } else if (uretim.gelenMiktar === uretim.gidenMiktar && kodVar) {
//             await uretimiTamamlananlaraGonder(uretim);
//           }
//         }
//       } catch (error) {
//         console.error(`Tamamlanan üretime taşımada hata: ${uretimId}`, error);
//         res.send(error);
//       }
//     });

//     await Promise.all(promises);

//     res.send("Üretimler kontrol edildi. Tamamlananlar Tamamlanan üretime taşındı.");
//   }),
// );

router.post(
  "/tamamlanan",
  asyncHandler(async (req, res) => {
    const kayitlar = req.body;
    const model = { 1: DFasonUretim, 0: DNormalUretim };

    try {
      // Tüm asenkron işlemleri bir diziye topla
      const promises = kayitlar.map(async (kayit) => {
        const uretimIdleri = kayit.uretimId.split(",").map(Number);
        const { fason } = kayit.Referanslar;
        const uretimList = await model[fason].findAll({
          where: { id: uretimIdleri },
          include: [
            {
              model: Referans,
              as: "Referanslar",
              include: [
                {
                  model: ReferansUretim,
                  as: "ReferansUretim",
                },
              ],
            },
          ],
        });

        for (const uretim of uretimList) {
          const kodVar = !uretim.Referanslar.kodu.toLowerCase().includes("yok");

          if (fason) {
            if (uretim.gelenMiktar === uretim.sevkEdilenMiktar && kodVar) {
              await uretimiTamamlananlaraGonder(uretim);
            }
          } else if (uretim.gelenMiktar === uretim.gidenMiktar && kodVar) {
            await uretimiTamamlananlaraGonder(uretim);
          }
        }
      });

      await Promise.all(promises);
      res.send("Üretimler kontrol edildi. Tamamlananlar tamamlanan üretime taşındı.");
    } catch (error) {
      console.error(`Tamamlanan üretime taşımada hata:`, error);
      res.status(500).send("İşlem sırasında bir hata oluştu.");
    }
  }),
);

async function uretimiTamamlananlaraGonder(uretim) {
  const { fason, musteriAdi, fasonFirmasi, siparisTipi, kodu, islemTipi, irsaliyeAciklamasi } = uretim.Referanslar;

  const devamEdenModel = { 1: DFasonUretim, 0: DNormalUretim };
  const tamamlananModel = { 1: TFasonUretim, 0: TNormalUretim };

  const { id, ...rest } = uretim.dataValues; // tamamlananlarda aynı id ye sahip kayıt varsa sorun olur diye

  const eklenenUretim = await tamamlananModel[fason].create({
    uretimId: uretim.id, // devam eden üretimlerdeki id (sevkiyat hareketleri için gerekli)
    musteriAdi,
    fasonFirmasi,
    siparisTipi,
    kodu,
    islemTipi,
    irsaliyeAciklamasi,
    ...rest,
  });

  await devamEdenModel[fason].destroy({ where: { id: uretim.id } });

  return eklenenUretim;
}

export default router;
