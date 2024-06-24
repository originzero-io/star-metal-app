import "./config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import db from "./dbConnection.js";
import apiErrorHandler from "./api/errorHandler.js";
import router from "./api/router.js";
import { findDirname } from "./utils/file.js";

const app = express();
const PORT = 6333;

app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use("/", router);
app.use("/uploads", express.static(`${findDirname(import.meta.url)}/api/uploads`));
app.use(apiErrorHandler);

db.sync().then(() => {
  app.listen(PORT, () => {
    console.log("---------------------------------------------");
    console.log(`Local: http://localhost:${PORT}`);
    console.log("---------------------------------------------");
  });
});
