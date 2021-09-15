const Product = require('../models/product');

exports.disableProducts = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { id: item.id },
        update: { isActive: false }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};
