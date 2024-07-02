import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";
import Referans, { ReferansUretim } from "./referans.model.js";

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
    allowNull: true,
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
};

export const DNormalUretim = sequelize.define(
  "DNormalUretimler",
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
    tableName: "DNormalUretimler",
    timestamps: false,
  },
);

// • Bir DNormalUretim kaydı bir Referans kaydına aittir.
// • Bir Referans kaydı birden fazla DNormalUretim kaydına sahip olabilir.
DNormalUretim.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(DNormalUretim, { foreignKey: "referansNo", sourceKey: "referansNo" });

DNormalUretim.afterCreate(async (instance, options) => {
  await instance.reload({
    include: [
      {
        model: Referans,
        as: "Referanslar",
        include: [
          {
            model: ReferansUretim,
            as: "ReferansUretim",
          },
        ],
      },
    ],
  });
});
DNormalUretim.afterUpdate(async (instance, options) => {
  await instance.reload({
    include: [
      {
        model: Referans,
        as: "Referanslar",
        include: [
          {
            model: ReferansUretim,
            as: "ReferansUretim",
          },
        ],
      },
    ],
  });
});

export const DFasonUretim = sequelize.define(
  "DFasonUretimler",
  {
    ...ortakSütunlar,
    sevkEdilenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "DFasonUretimler",
    timestamps: false,
  },
);

// • Bir DFasonUretim kaydı bir Referans kaydına aittir.
// • Bir Referans kaydı birden fazla DFasonUretim kaydına sahip olabilir.
DFasonUretim.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(DFasonUretim, { foreignKey: "referansNo", sourceKey: "referansNo" });

DFasonUretim.afterCreate(async (instance, options) => {
  await instance.reload({
    include: [
      {
        model: Referans,
        as: "Referanslar",
        include: [
          {
            model: ReferansUretim,
            as: "ReferansUretim",
          },
        ],
      },
    ],
  });
});
DFasonUretim.afterUpdate(async (instance, options) => {
  await instance.reload({
    include: [
      {
        model: Referans,
        as: "Referanslar",
        include: [
          {
            model: ReferansUretim,
            as: "ReferansUretim",
          },
        ],
      },
    ],
  });
});

// ** TAMAMLANAN ÜRETİM

export const TNormalUretim = sequelize.define(
  "TNormalUretimler",
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
    resimUrl: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    not: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },
    irsaliyeAciklamasi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
  },
  {
    tableName: "TNormalUretimler",
    timestamps: false,
  },
);

export const TFasonUretim = sequelize.define(
  "TFasonUretimler",
  {
    ...ortakSütunlar,
    sevkEdilenMiktar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fasonFirmasi: {
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
    resimUrl: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    not: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },
    irsaliyeAciklamasi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
  },
  {
    tableName: "TFasonUretimler",
    timestamps: false,
  },
);

// DNormalUretim.sync({ force: true });
// DFasonUretim.sync({ force: true });
// TNormalUretim.sync({ force: true });
// TFasonUretim.sync({ force: true });
