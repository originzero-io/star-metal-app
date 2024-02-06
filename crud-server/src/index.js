import "./config.js";
import db from "./dbConnection.js";

import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./api/router.js";
import apiErrorHandler from "./api/errorHandler.js";

const app = express();
const PORT = 6333;

app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use("/", router);

app.use("/uploads", express.static("api/uploads"));

// app.use(apiErrorHandler);

db.sync().then(() => {
  app.listen(PORT, () => {
    console.log("---------------------------------------------");
    console.log(`Local: http://localhost:${PORT}`);
    console.log("---------------------------------------------");
  });
});
