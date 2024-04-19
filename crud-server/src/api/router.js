import express from "express";
import uretimler from "./routes/uretim.route.js";
import uretimGirisleri from "./routes/uretim-girisi.route.js";
import irsaliyeler from "./routes/irsaliye.route.js";
import musteriler from "./routes/musteri.route.js";
import referanslar from "./routes/referans.route.js";
import ambalajlar from "./routes/ambalaj.route.js";
import personeller from "./routes/personel.route.js";
import sicakliklar from "./routes/sicaklik.route.js";
import banyolar from "./routes/banyo.route.js";
import butonlar from "./routes/buton.route.js";

import db from "../dbConnection.js";

const router = express.Router();

router.use("/", async (req, res, next) => {
  try {
    await db.authenticate();
    next();
  } catch (error) {
    res.send("DB is closed.");
  }
});

router.use("/uretim", uretimler); // devam-eden / tamamlanan
router.use("/uretim-girisleri", uretimGirisleri);
router.use("/irsaliyeler", irsaliyeler);
router.use("/musteriler", musteriler);
router.use("/referanslar", referanslar);
router.use("/ambalajlar", ambalajlar);
router.use("/personeller", personeller);

router.use("/sicaklik", sicakliklar); // sadece get
router.use("/banyo", banyolar); // sadece get
router.use("/butonlar", butonlar); // sadece get

export default router;
