const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
// const Order = require('../../models/order');
// const Cart = require('../../models/cart');
// const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const db = require("../../models");
const Order = db.order;
const User = db.user;
const Product = db.product;
const OrderDetail = db.orderDetail;

// fetch stats api
router.get('/', auth, role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      const { user } = req;
      let orders = []
      let users = []
      let orderDetails = []
      if (user.role === role.ROLES.Admin) {
        orders = await Order.findAll();
        users = await User.findAll();
        orderDetails = await OrderDetail.findAll();
      } else if (user.role === role.ROLES.Merchant) {
        orderDetails = await OrderDetail.findAll({ where: { merchant: user.id } });
        orders = orderDetails;
      }

      let newOrders = orders.filter(item => item.status === 'Not processed').length
      let delivered = orders.filter(item => item.status === 'Delivered').length
      let inProgress = orders.filter(item => item.status === 'Processing').length
      let totalUsers = users.length
      let totalRevenue = 0

      for (let item of orderDetails) {
        if (item.status === 'Delivered') {
          totalRevenue += item.quantity * item.productPrice
        }
      }

      res.status(200).json({
        newOrders: newOrders || 0,
        delivered: delivered || 0,
        inProgress: inProgress || 0,
        totalUsers: totalUsers || 0,
        totalRevenue: totalRevenue || 0,
      });
    } catch (error) {
      console.log(error);

      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  });


module.exports = router;
