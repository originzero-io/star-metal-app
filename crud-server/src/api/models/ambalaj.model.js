import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Ambalaj = sequelize.define(
  "Ambalajlar",
  {
    kasaAdi: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    kasaTanimi: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    kasaOlcusu: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    dara: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    resimUrl: {
      type: DataTypes.STRING(35),
      allowNull: false,
    },
  },
  {
    // Model seçenekleri
    tableName: "Ambalajlar",
    timestamps: false,
  },
);

// Ambalaj.sync({ alter: true });

export default Ambalaj;
