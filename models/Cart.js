const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

module.exports = Cart;
