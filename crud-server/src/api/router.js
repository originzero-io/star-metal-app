import express from "express";
import uretimler from "./entities/uretim.route.js";
import musteriler from "./entities/musteri.route.js";
import referanslar from "./entities/referans.route.js";
import ambalajlar from "./entities/ambalaj.route.js";
import sicakliklar from "./entities/sicaklik.route.js";
import banyolar from "./entities/banyo.route.js";
import butonlar from "./entities/buton.route.js";

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

router.use("/uretim", uretimler); // devam-eden / tamamlanan / rapor
router.use("/musteriler", musteriler);
router.use("/referanslar", referanslar);
router.use("/ambalajlar", ambalajlar);

router.use("/sicaklik", sicakliklar); // sadece get
router.use("/banyo", banyolar); // sadece get
router.use("/butonlar", butonlar); // sadece get

export default router;
