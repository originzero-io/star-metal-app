import Sequelize from "sequelize";
import tedious from "tedious";

const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mssql",
  dialectModule: tedious, // mssql için gerekli paket
  dialectOptions: {
    // MS SQL Server sürümüne göre ekstra seçenekler burada belirtilebilir
  },
  logging: false, // Sorguların konsola loglanmasını kapatır
  pool: {
    max: 20, // Havuzdaki maksimum bağlantı sayısı
    min: 0, // Havuzdaki minimum bağlantı sayısı
    acquire: 30000, // Bağlantı edinme süresi
    idle: 20000, // Boşta kalma süresi
  },
});
export default sequelize;
