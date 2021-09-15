


module.exports = (sequelize, Sequelize) => {

  const Product = sequelize.define("Product", {
    sku: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING,
      trim: true
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    imageKey: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING,
      trim: true
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.INTEGER
    },
    taxable: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    brand: {
      type: Sequelize.INTEGER,
      // allowNull: false,
      // references: {         // User belongsTo Company 1:1
      //   model: 'brand',
      //   key: 'id'
      // }
    },
    category: {
      type: Sequelize.INTEGER,
      // allowNull: false,
      // references: {         // User belongsTo Company 1:1
      //   model: 'category',
      //   key: 'id'
      // }
    },
    merchant:{
      type: Sequelize.INTEGER
    },
  updated: Sequelize.DATE,
  created: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  }
  });
  return Product;
};


