import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";
import Referans from "./referans.model.js";

const ortakSütunlar = {
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
  tamamlandi: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};

export const NormalUretim = sequelize.define(
  "NormalUretimler",
  {
    ...ortakSütunlar,
    kalanMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uretilmeyenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acil: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "NormalUretimler",
    timestamps: false,
  },
);

// • Bir NormalUretim kaydı bir Referans kaydına aittir.
// • Bir Referans kaydı birden fazla NormalUretim kaydına sahip olabilir.
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
    ...ortakSütunlar,
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

// • Bir FasonUretim kaydı bir Referans kaydına aittir.
// • Bir Referans kaydı birden fazla FasonUretim kaydına sahip olabilir.
FasonUretim.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(FasonUretim, { foreignKey: "referansNo", sourceKey: "referansNo" });

FasonUretim.afterCreate(async (instance, options) => {
  await instance.reload({ include: [{ model: Referans, as: "Referanslar" }] });
});
FasonUretim.afterUpdate(async (instance, options) => {
  await instance.reload({ include: [{ model: Referans, as: "Referanslar" }] });
});
