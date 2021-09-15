
module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("Brand", {
  name: {
    type: Sequelize.STRING,
    // trim: true
  },
  slug: {
    type: Sequelize.STRING,
    slug: 'name',
    unique: true
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING,
    trim: true
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  merchant: {
    type: Sequelize.STRING,
    // type: Schema.Types.ObjectId,
    ref: 'Merchant',
    defaultValue: null
  },
  updated: Sequelize.DATE,
  created: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  }
  });

  return Brand;
};
