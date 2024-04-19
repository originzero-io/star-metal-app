import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Musteri = sequelize.define(
  "Musteriler",
  {
    musteriLogoKodu: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    musteriAdi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    adres: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    vergiDairesi: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    vergiNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    telefon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    yetkili: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kepAdresi: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    // Model seçenekleri
    tableName: "Musteriler",
    timestamps: false,
  },
);
// Musteri.sync({ alter: true });
export default Musteri;
