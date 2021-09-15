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
const Product = db.product;
const OrderDetail = db.orderDetail;
router.post('/add', auth, async (req, res) => {
  try {
    const user = req.user.id;
    const { cart, total } = req.body;
    console.log(req.body, 'req.body');

    const order = {

      user,
      total,
      // status: 'Not processed'
    };

    Order.create(order).then(async savedOrder => {

      for (let cartItem of cart) {
        let orderDetail = {
          merchant: cartItem.merchant,
          orderNo: savedOrder.id,
          product: cartItem.id,
          productPrice: cartItem.price,
          quantity: cartItem.quantity
        }

        await OrderDetail.create(orderDetail)

      }

      res.status(200).json({
        success: true,
        message: `Your order has been placed successfully!`,
        order: { id: savedOrder.id }
      });

    }).catch(err => {
      console.log(err);
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    })


  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch all orders api
router.get('/list', auth, async (req, res) => {
  try {
    const { user } = req;
    let orders = []
    if (user.role === role.ROLES.Admin) {
      orders = await Order.findAll();
    } else if (user.role === role.ROLES.Merchant) {
      orders = await Order.findAll({ include: [{ model: OrderDetail, where: { merchant: user.id }, include: [Product] }] });
    } else if (user.role === role.ROLES.Customer) {
      orders = await Order.findAll({ where: { user: user.id }, include: [{ model: OrderDetail, include: [Product] }] });
    }

    res.status(200).json({
      orders
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch order api
router.get('/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const user = req.user.id;

    let condition = req.user.role === role.ROLES.Customer ? { id: orderId, user } : { id: orderId }
    let condition2 = req.user.role === role.ROLES.Merchant ? { merchant:user } : {}

    const orderDoc = await Order.findOne({
      where: condition, include: [{ model: OrderDetail, include: [Product], where:condition2 }]
    })

    if (!orderDoc) {
      res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`
      });
    }

    res.status(200).json({
      order: orderDoc
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.delete('/cancel/:orderId', auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    Order.update({ status: 'Cancelled' }, { where: { id: orderId } })
    OrderDetail.update({ status: 'Cancelled' }, { where: { orderNo: orderId } })

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/change-status/:orderId', auth, role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
 async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = req.body.status;

   await Order.update({ status }, { where: { id: orderId } })

    let orderProudcts =await OrderDetail.findAll({where: {orderNo: orderId}})
    console.log(orderProudcts);
    
    filterdOrderProudcts = orderProudcts.filter(item => item.status != 'Cancelled')
    if(filterdOrderProudcts){
      for(let ord of filterdOrderProudcts){
       await OrderDetail.update({ status }, { where: { id: ord.id } })
      }
    }

    res.status(200).json({
      success: true
    });
  } catch (error) {
    console.log(error, 'error');
    
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


router.put('/cancel/item/:itemId', auth, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const orderId = req.body.orderId;

    await OrderDetail.update({ status: 'Cancelled' }, { where: { id: itemId } });
    let orders = await OrderDetail.findAll({ where: { orderNo: orderId } })

    if (orders.some(order => order.status != 'Cancelled')) {
      await Order.update({ status: 'Cancelled' }, { where: { id: orderId } });
    }

    res.status(200).json({
      success: true,
      message: 'Item has been cancelled successfully!'
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


const increaseQuantity = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { id: item.product },
        update: { $inc: { quantity: +item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;
