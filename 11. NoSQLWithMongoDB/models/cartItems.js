// {ADD CART MODEL} //
const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const CartItem = sequelize.define("cartitems", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER
  }
});

module.exports = CartItem;
