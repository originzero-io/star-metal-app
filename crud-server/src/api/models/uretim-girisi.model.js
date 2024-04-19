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
    uretimSiraNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    siparisNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    talepNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    irsaliyeNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    iade: {
      type: DataTypes.STRING(5), // EVET / HAYIR
      allowNull: false,
    },
    uretimTarihi: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    uretimAdedi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    personel: {
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
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "UretimGirisleri",
    timestamps: false,
  },
);

UretimGirisi.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(UretimGirisi, { foreignKey: "referansNo", sourceKey: "referansNo" });

// UretimGirisi.sync({ force: true });

export default UretimGirisi;
