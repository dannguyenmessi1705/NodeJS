// const { DataTypes } = require("sequelize"); // Thêm module DataTypes có chức năng tạo các kiểu dữ liệu cho database từ sequelize
// const sequelize = require("../util/database"); // Thêm module sequelize đã tạo ở file database.js

// // Tạo 1 model có tên là products (khi chạy, MySQL tự chuyển tên thành in thường và thêm 's')
// // có các thuộc tính là id, name, price, description đã tạo sẵn và tự thêm 2 thuộc tính createdAt và updatedAt
// const Product = sequelize.define("products", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     unique: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.CHAR(50),
//     allowNull: false,
//   },
//   price: {
//     type: DataTypes.DOUBLE,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
// });

// module.exports = Product;
