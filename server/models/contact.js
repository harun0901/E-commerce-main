
module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define("Contact", {
    name: {
      type: Sequelize.STRING,
      trim: true
    },
    email: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING,
      trim: true
    },
  updated: Sequelize.DATE,
  created: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  }
  });

  return Contact;
};


