const {Sequelize} = require("sequelize"); // Thêm module sequelize vào biến Sequelize (object)

// Tạo 1 connect đến database: new Sequelize(database, user, password, {host: địa chỉ, dialect: tên db})
const sequelize = new Sequelize("node-shop", "root", "17052002", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
