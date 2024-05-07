import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Referans = sequelize.define(
  "Referanslar",
  {
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    parcaAdi: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    irsaliyeAciklamasi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    musteriAdi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    cikisReferansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    siparisTipi: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    siparisNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    fason: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    fasonFirmasi: {
      type: DataTypes.STRING(40),
      allowNull: true,
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
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    islemTipi: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    birim: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    resimUrl: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    not: {
      type: DataTypes.STRING(600),
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

// Referans.sync({ alter: true });

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

export const ReferansParcaAdi = sequelize.define(
  "ReferansParcaAdlari",
  {
    parcaAdi: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    // Model seçenekleri
    tableName: "ReferansParcaAdlari",
    timestamps: false,
  },
);
