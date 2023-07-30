// {CREAT ORDER MODEL} //
const {DataTypes} = require('sequelize');
const sequelize = require("../util/database")

const Order = sequelize.define("orders", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false, 
        primaryKey: true
    }
})
module.exports = Order