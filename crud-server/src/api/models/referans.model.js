import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

// ********** Logo Api
// {
//   "referansNo": "string",
//   "parcaAdi": "string",
//   "irsaliyeAciklamasi": "string",
//   "siparisTipi": "string",
//   "siparisNo": "string",
//   "fason": 0,
//   "miktarSapmasi": 0,
//   "lotAdedi": 0,
//   "referansYuzeyAlani": 0,
//   "islemTipi": "string",
//   "resimUrl": "string",
//   "not": "string",
//   "logoMalzemeRef": 0,
//   "logoAnaBirimRef": 0,
//   "musteriRef": 0,
//   "musteriAdi": "string",
//   "fasonFirmaRef": 0,
//   "fasonFirmasi": "string"
// }
// ************

const Referans = sequelize.define(
  "Referanslar",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    logoMalzemeRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    logoAnaBirimRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    musteriRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    parcaAdi: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    irsaliyeAciklamasi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    musteriAdi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    siparisTipi: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    kodu: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    fason: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fasonFirmaRef: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fasonFirmasi: {
      type: DataTypes.STRING(70),
      allowNull: true,
    },
    islemTipi: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  },
  {
    tableName: "Referanslar",
    timestamps: false,
  },
);

// Referans.sync({ force: true });

export const ReferansUretim = sequelize.define(
  "ReferansUretim",
  {
    logoMalzemeRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    kodu: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    miktarSapmasi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lotAdedi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referansYuzeyAlani: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
    },
    resimUrl: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    not: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "ReferansUretim",
    timestamps: false,
  },
);

// ReferansUretim.sync({ force: true });

Referans.hasOne(ReferansUretim, { foreignKey: "logoMalzemeRef", sourceKey: "logoMalzemeRef", as: "ReferansUretim" });
ReferansUretim.belongsTo(Referans, { foreignKey: "logoMalzemeRef", targetKey: "logoMalzemeRef", as: "Referans" });

export default Referans;
