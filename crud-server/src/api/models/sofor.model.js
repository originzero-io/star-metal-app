import { DataTypes } from "sequelize";
import sequelize from "../../dbConnection.js";

const Sofor = sequelize.define(
  "Soforler",
  {
    soforLogoKodu: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ad: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    soyad: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    tc: {
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
// Sofor.sync({ alter: true });
export default Sofor;
