import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Sofor = sequelize.define(
  "Soforler",
  {
    logicalref: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    adi: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    soyadi: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    kimlikNo: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
  },
  {
    // Model seçenekleri
    tableName: "Soforler",
    timestamps: false,
  },
);
// Sofor.sync({ force: true });
export default Sofor;
