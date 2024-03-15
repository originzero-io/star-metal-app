import { DataTypes } from "sequelize";
import sequelize from "../../../dbConnection.js";
import Referans from "./referans.model.js";

const DevamEdenUretim = sequelize.define(
  "DevamEdenUretimler",
  {
    irsaliyeNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    getirenSofor: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    kontrolEden: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    malzemeTipi: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    islemAciklama: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    siparisNo: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    talepNo: {
      type: DataTypes.STRING(30),
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
    gelenTarih: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    adet: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gidenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kalanMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uretilenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uretilmeyenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "DevamEdenUretimler",
    timestamps: false,
  },
);

DevamEdenUretim.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(DevamEdenUretim, { foreignKey: "referansNo", sourceKey: "referansNo" });

export default DevamEdenUretim;
