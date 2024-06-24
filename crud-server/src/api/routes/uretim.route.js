import express from "express";
import asyncHandler from "express-async-handler";
import Irsaliye from "../models/irsaliye.model.js";
import Referans from "../models/referans.model.js";
import UretimGirisi from "../models/uretim-girisi.model.js";
import { FasonUretim, NormalUretim } from "../models/uretim.model.js";

const router = express.Router();

router.get(
  "/devam-eden",
  asyncHandler(async (req, res) => {
    const normalUretimler = await NormalUretim.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
        },
      ],
      where: { tamamlandi: false },
    });
    const fasonUretimler = await FasonUretim.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
        },
      ],
      where: { tamamlandi: false },
    });

    res.send({ normalUretimler, fasonUretimler });
  }),
);

router.get(
  "/devam-eden/fason/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const fasonUretim = await FasonUretim.findOne({
      where: { id },
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
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
        const fasonUretimler = await FasonUretim.create({
          ...malzeme,
          sevkEdilenMiktar: malzeme.gidenMiktar,
        });
        newMalzemeler.fasonUretimler.push(fasonUretimler);
        return fasonUretimler;
      }
      const normalUretimler = await NormalUretim.create({
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

    // newData, mevcut değerle aynı gelirse update hook u çalışmıyor. Bu durumun önüne geçmek için modeli reload yapıyoruz.
    await uretim.reload({ include: [{ model: Referans, as: "Referanslar" }] });

    res.json(uretim);
  }),
);

router.put(
  "/devam-eden/talepNo",
  asyncHandler(async (req, res) => {
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

    // newData, mevcut değerle aynı gelirse update hook u çalışmıyor. Bu durumun önüne geçmek için modeli reload yapıyoruz.
    await uretim.reload({ include: [{ model: Referans, as: "Referanslar" }] });

    res.json(uretim);
  }),
);

router.put(
  "/devam-eden/oncelikAyarla",
  asyncHandler(async (req, res) => {
    const { currentRecord, newOncelikDurumu } = req.body;

    const uretim = await NormalUretim.findByPk(currentRecord.id);
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
      await FasonUretim.destroy({
        where: { id: kayit.id },
      });
    } else {
      await NormalUretim.destroy({
        where: { id: kayit.id },
      });
    }

    await UretimGirisi.destroy({
      where: { uretimSiraNo: kayit.id },
    });
    await Irsaliye.destroy({
      where: { uretimSiraNo: kayit.id },
    });

    res.send("ok");
  }),
);

router.get(
  "/tamamlanan",
  asyncHandler(async (req, res) => {
    const normalUretimler = await NormalUretim.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
        },
      ],
      where: { tamamlandi: true },
    });
    const fasonUretimler = await FasonUretim.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
        },
      ],
      where: { tamamlandi: true },
    });

    res.send({ normalUretimler, fasonUretimler });
  }),
);

router.post(
  "/tamamlanan",
  asyncHandler(async (req, res) => {
    res.send("aman");
  }),
);

export default router;
