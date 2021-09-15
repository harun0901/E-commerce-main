const dbConfig = require("../config/db");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.brand = require("./brand")(sequelize, Sequelize);
db.user = require("./user")(sequelize, Sequelize);
// db.address = require("./address")(sequelize, Sequelize);
// db.cart = require("./cart")(sequelize, Sequelize);
db.category = require("./category")(sequelize, Sequelize);
// db.contact = require("./contact")(sequelize, Sequelize);
db.orderDetail = require("./orderDetail")(sequelize, Sequelize);
db.order = require("./order")(sequelize, Sequelize);
db.product = require("./product")(sequelize, Sequelize);

db.brand.hasMany(db.product, {foreignKey: 'id'})
db.product.belongsTo(db.brand, {foreignKey: 'brand'})

db.category.hasMany(db.product, {foreignKey: 'id', })
db.product.belongsTo(db.category, {foreignKey: 'category'})

db.product.hasMany(db.orderDetail, {foreignKey: 'id'})
db.orderDetail.belongsTo(db.product, {foreignKey: 'product'})

db.order.hasMany(db.orderDetail, {foreignKey: 'orderNo'})
db.orderDetail.belongsTo(db.order, {foreignKey: 'id'})

module.exports = db;