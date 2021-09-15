
module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
  name: {
    type: Sequelize.STRING,
    trim: true
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
  updated: Sequelize.DATE,
  created: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  }
  });

  return Category;
};
