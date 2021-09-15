
module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("Address", {
    user: {
      type: Sequelize.STRING,
      // type: Schema.Types.ObjectId,
      ref: 'User'
    },
    address: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    zipCode: {
      type: Sequelize.STRING
    },
    isDefault: {
      type: Sequelize.BOOLEAN,
      default: false
    },
  updated: Sequelize.DATE,
  created: {
    type: Sequelize.DATE,
    default: Date.now
  }
  });

  return Address;
};

