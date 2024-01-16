import Sequelize from "sequelize";
import tedious from "tedious";

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "mssql",
  dialectModule: tedious, // mssql için gerekli paket
  dialectOptions: {
    // MS SQL Server sürümüne göre ekstra seçenekler burada belirtilebilir
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 20000,
  },
});
export default sequelize;
