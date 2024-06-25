import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";
import Referans from "./referans.model.js";

const UretimGirisi = sequelize.define(
  "UretimGirisleri",
  {
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    uretimId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    irsaliyeNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    iade: {
      type: DataTypes.STRING(5), // EVET / HAYIR
      allowNull: false,
    },
    uretimTarihi: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sevkTarihi: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sofor: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    plaka: {
      type: DataTypes.STRING(14),
      allowNull: true,
    },
    uretimAdedi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    personel: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    birinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    ikinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    brut: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dara: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    net: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    aktif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "UretimGirisleri",
    timestamps: false,
  },
);

// • Bir UretimGirisi kaydı bir Referans kaydına aittir.
// • Bir Referans kaydı birden fazla UretimGirisi kaydına sahip olabilir.
UretimGirisi.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo", as: "Referanslar" });
Referans.hasMany(UretimGirisi, { foreignKey: "referansNo", sourceKey: "referansNo", as: "UretimGirisleri" });

// UretimGirisi.sync({ force: true });

export default UretimGirisi;
