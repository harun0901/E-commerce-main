
module.exports = (sequelize, Sequelize) => {
  const OrderDetail = sequelize.define("OrderDetail", {
    merchant: {
      type: Sequelize.INTEGER,
    },
    orderNo:{
      type: Sequelize.INTEGER
    },
    product: {
      type: Sequelize.INTEGER
    },
    productPrice: {
      type: Sequelize.INTEGER
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue: 'Not processed',
      values: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
  updated: Sequelize.DATE,
  created: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  }
  });

  return OrderDetail;
};


