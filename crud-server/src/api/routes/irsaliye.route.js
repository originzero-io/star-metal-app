import express from "express";
import asyncHandler from "express-async-handler";
import Irsaliye from "../models/irsaliye.model.js";
import Referans from "../models/referans.model.js";
import { DFasonUretim } from "../models/uretim.model.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const irsaliyeler = await Irsaliye.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
        },
      ],
      order: [["id", "ASC"]],
    });
    res.send(irsaliyeler);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const idsizIrsaliyeler = req.body.map(({ id, ...kayit }) => kayit);
    await Irsaliye.bulkCreate(idsizIrsaliyeler);

    const butunIrsaliyeler = await Irsaliye.findAll({
      include: [
        {
          model: Referans,
          required: false, // true ise INNER JOIN yapar, false ise LEFT OUTER JOIN yapar
          as: "Referanslar",
        },
      ],
    });
    res.json(butunIrsaliyeler);
  }),
);

router.post(
  "/fasona",
  asyncHandler(async (req, res) => {
    const irsaliyeKaydi = req.body;

    const idsizIrsaliyeKaydi = { ...irsaliyeKaydi };
    delete idsizIrsaliyeKaydi.id;

    await Irsaliye.create(idsizIrsaliyeKaydi);

    const fasonUretim = await DFasonUretim.findOne({ where: { id: irsaliyeKaydi.id } });

    if (fasonUretim) {
      await DFasonUretim.update({ gidenMiktar: irsaliyeKaydi.gelenMiktar }, { where: { id: irsaliyeKaydi.id } });
    } else {
      console.log(`ReferansNo ${irsaliyeKaydi.referansNo} için kayıt bulunamadı.`);
    }

    res.send("Fasona irsaliye kesildi, giden miktar gelen miktarla eşitlendi");
  }),
);

router.post(
  "/temizle",
  asyncHandler(async (req, res) => {
    const selectedRows = req.body;

    selectedRows.forEach(async (row) => {
      await Irsaliye.destroy({
        where: { id: row.id },
      });
    });

    res.send("İrsaliye listesi temizlendi");
  }),
);

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { selectedRows } = req.body;

    const deletePromises = selectedRows.map(async (row) => {
      await Irsaliye.destroy({
        where: { id: row.id },
      });

      if (row.fasona) {
        await fasonKaydiniSifirla(row);
      }
    });

    await Promise.all(deletePromises);

    res.send("Silme işlemi başarıyla tamamlandı.");
  }),
);

const fasonKaydiniSifirla = async (row) => {
  const uretim = await DFasonUretim.findByPk(Number(row.uretimGirisiIdleri));
  if (uretim) {
    await uretim.update({
      gidenMiktar: 0,
    });
  } else {
    console.log("böyle bir fason üretim bulunamadı", row.id);
  }
};

export default router;
