
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
  email: {
    type: Sequelize.STRING,
    required: () => {
      return this.provider !== 'email' ? false : true;
    }
  },
  phoneNumber:{
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  merchantRequest: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  },
  provider: {
    type: Sequelize.STRING,
    required: true,
    defaultValue: 'email'
  },
  avatar: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.ENUM,
    defaultValue: 'ROLE_MEMBER',
    values: ['ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_MERCHANT']
  },
  resetPasswordToken: { type: Sequelize.STRING },
  resetPasswordExpires: { type: Sequelize.DATE },
  updated: Sequelize.DATE,
  created: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  }
  });

  return User;
};
