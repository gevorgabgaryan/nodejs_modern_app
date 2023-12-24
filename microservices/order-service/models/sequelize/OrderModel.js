import { DataTypes } from 'sequelize'

const OrderModel = (sequelize) => {
  const Order = sequelize.define('Order', {
    userId: DataTypes.STRING(24),
    email: DataTypes.STRING,
    status: DataTypes.STRING
  })
  return Order
}

export default OrderModel
