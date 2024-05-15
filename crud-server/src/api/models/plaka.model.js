import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Plaka = sequelize.define(
  "Plakalar",
  {
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
