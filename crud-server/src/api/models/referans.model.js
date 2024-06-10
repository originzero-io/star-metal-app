import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Referans = sequelize.define(
  "Referanslar",
  {
    logoMalzemeRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    logoAnaBirimRef: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // unique: true,
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
    siparisNo: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    fason: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fasonFirmasi: {
      type: DataTypes.STRING(70),
      allowNull: true,
    },
    miktarSapmasi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lotAdedi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    referansYuzeyAlani: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    islemTipi: {
      type: DataTypes.STRING(30),
      allowNull: true,
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

export const ReferansIslemTipi = sequelize.define(
  "ReferansIslemTipleri",
  {
    logicalref: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    adi: {
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
    logicalref: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    adi: {
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
