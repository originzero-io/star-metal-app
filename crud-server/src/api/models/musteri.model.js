import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Musteri = sequelize.define(
  "Musteriler",
  {
    logoRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kodu: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    sahisFirmasi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    adi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    soyadi: {
      type: DataTypes.STRING(70),
      allowNull: true,
    },
    unvani: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    adres: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    il: {
      type: DataTypes.STRING(13),
      allowNull: false,
    },
    ilce: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    ulke: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    postaKodu: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    vergiDairesi: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    vergiNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    kimlikNo: {
      type: DataTypes.STRING(11),
      allowNull: true,
    },
    telefon: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    yetkili: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
  },
  {
    // Model seçenekleri
    tableName: "Musteriler",
    timestamps: false,
  },
);
// Musteri.sync({ force: true });
export default Musteri;
