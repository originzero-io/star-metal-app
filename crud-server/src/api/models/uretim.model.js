import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";
import Referans from "./referans.model.js";

export const NormalUretim = sequelize.define(
  "NormalUretimler",
  {
    irsaliyeNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    getirenSofor: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    personel: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    iade: {
      type: DataTypes.STRING(5), // EVET / HAYIR
      allowNull: false,
    },
    talepNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    gelenTarih: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    ikinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    gelenMiktar: {
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
    tableName: "NormalUretimler",
    timestamps: false,
  },
);

NormalUretim.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(NormalUretim, { foreignKey: "referansNo", sourceKey: "referansNo" });

NormalUretim.afterCreate(async (instance, options) => {
  await instance.reload({ include: [{ model: Referans, as: "Referanslar" }] });
});
NormalUretim.afterUpdate(async (instance, options) => {
  await instance.reload({ include: [{ model: Referans, as: "Referanslar" }] });
});

export const FasonUretim = sequelize.define(
  "FasonUretimler",
  {
    irsaliyeNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    getirenSofor: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    personel: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    referansNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    iade: {
      type: DataTypes.STRING(5), // EVET / HAYIR
      allowNull: false,
    },
    talepNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    gelenTarih: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    ikinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    gelenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gidenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uretilenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sevkEdilenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "FasonUretimler",
    timestamps: false,
  },
);

FasonUretim.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(FasonUretim, { foreignKey: "referansNo", sourceKey: "referansNo" });

FasonUretim.afterCreate(async (instance, options) => {
  await instance.reload({ include: [{ model: Referans, as: "Referanslar" }] });
});
FasonUretim.afterUpdate(async (instance, options) => {
  await instance.reload({ include: [{ model: Referans, as: "Referanslar" }] });
});
