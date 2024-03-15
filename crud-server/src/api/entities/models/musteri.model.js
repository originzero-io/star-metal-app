import { DataTypes } from "sequelize";
import sequelize from "../../../dbConnection.js";

const Musteri = sequelize.define(
  "Musteriler",
  {
    musteriAdi1: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    musteriAdi2: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    adres1: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    adres2: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    il: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    ilce: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    vergiDairesi: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    vergiHesapNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    // Model seçenekleri
    tableName: "Musteriler",
    timestamps: false,
  },
);

export default Musteri;
