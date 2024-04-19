import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Ambalaj = sequelize.define(
  "Ambalajlar",
  {
    kasaAdi: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    resimUrl: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  },
  {
    // Model seçenekleri
    tableName: "Ambalajlar",
    timestamps: false,
  },
);

export default Ambalaj;
