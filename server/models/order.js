
module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    user: {
      type: Sequelize.INTEGER,
    },
    total: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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

  return Order;
};


