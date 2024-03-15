import { DataTypes } from "sequelize";
import sequelize from "../../../dbConnection.js";

const Referans = sequelize.define(
  "Referanslar",
  {
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    siparisNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    islemAciklama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    irsaliyeAciklama: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    lotAdedi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    miktarSapmasi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referansYuzeyAlani: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    firmaAdi01: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    firmaAdi02: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birim: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    islemTipi: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    uretimAdediDegistirme: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    resimUrl: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
  },
  {
    // Model seçenekleri
    tableName: "Referanslar",
    timestamps: false,
  },
);

export default Referans;

export const ReferansIslemTipi = sequelize.define(
  "ReferansIslemTipleri",
  {
    islemTipi: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    // Model seçenekleri
    tableName: "ReferansIslemTipleri",
    timestamps: false,
  },
);
