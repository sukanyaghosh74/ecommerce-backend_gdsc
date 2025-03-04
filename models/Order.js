const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "completed"), defaultValue: "pending" }
});

module.exports = Order;
