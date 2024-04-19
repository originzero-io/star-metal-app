import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Personel = sequelize.define(
  "Personeller",
  {
    ad: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    soyad: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    telefon: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    tc: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    adres: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    yetki: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    parola: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    tableName: "Personeller",
    timestamps: false,
  },
);

export default Personel;
