import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";
import Referans from "./referans.model.js";

const Irsaliye = sequelize.define(
  "Irsaliyeler",
  {
    uretimGirisiIdleri: {
      type: DataTypes.STRING(70), // farklı üretim kayıtlarının id lerini tutar '1,2,3' gibi bir şekilde
      allowNull: false,
    },
    uretimSiraNo: {
      type: DataTypes.STRING(70), // farklı üretim kayıtlarının id lerini tutar '1,2,3' gibi bir şekilde
      allowNull: false,
    },
    tip: {
      type: DataTypes.STRING(10), // sevk veya taşıma
      allowNull: false,
    },
    fasona: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    referansNo: {
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
    birinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    ikinciAmbalaj: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  },
  {
    tableName: "Irsaliyeler",
    timestamps: false,
  },
);

// • Bir Irsaliye kaydı bir Referans kaydına aittir.
// • Bir Referans kaydı birden fazla Irsaliye kaydına sahip olabilir.

Irsaliye.belongsTo(Referans, { foreignKey: "referansNo", targetKey: "referansNo" });
Referans.hasMany(Irsaliye, { foreignKey: "referansNo", sourceKey: "referansNo" });

export default Irsaliye;
