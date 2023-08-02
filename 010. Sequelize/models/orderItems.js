// {CREAT ORDER ITEM MODEL} //
const {DataTypes} = require('sequelize');
const sequelize = require("../util/database")

const OrderItem = sequelize.define("orderitems", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false, 
        primaryKey: true
    },
    count: {
        type: DataTypes.INTEGER,
    }
})
module.exports = OrderItem
