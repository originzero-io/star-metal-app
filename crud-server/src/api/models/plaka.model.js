import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Plaka = sequelize.define(
  "Plakalar",
  {
    plakaLogoKodu: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    plaka: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
  },
  {
    // Model seçenekleri
    tableName: "Plakalar",
    timestamps: false,
  },
);
// Plaka.sync({ alter: true });
export default Plaka;
