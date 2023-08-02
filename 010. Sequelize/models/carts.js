// {ADD CART MODEL} //
const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Cart = sequelize.define("carts", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
  },
});

module.exports = Cart;
