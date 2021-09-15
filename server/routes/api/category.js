const express = require('express');
const router = express.Router();
const passport = require('passport');

// Bring in Models & Helpers
// const Category = require('../../models/category');
const db = require("../../models");
const Category = db.category;
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const store = require('../../helpers/store');
const upload = require('../../middleware/upload')

router.post('/add', auth, role.checkRole(role.ROLES.Admin),upload.single('image'), (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const isActive = req.body.isActive;
  const imageUrl = req.file ? req.file.filename : '';

  if (!description || !name) {
    return res
      .status(400)
      .json({ error: 'You must enter description & name.' });
  }

  const category = {
    name,
    description,
    isActive,
    imageUrl
  }

  Category.create(category).then((data) => {
    res.status(200).json({
      success: true,
      message: `Category has been added successfully!`,
      category: data
    });
  }).catch(err => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  })
});

// fetch store categories api
router.get('/list', (req, res) => {
  Category.findAll({ where: { isActive: true } }).then(data => {
    res.status(200).json({
      categories: data
    });
  }).catch(err => {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  })
});

router.get(
  '/list/select',
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
       let categories = await Category.findAll({}, 'name');

      res.status(200).json({
        categories
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// fetch categories api
router.get('/', (req, res) => {
  Category.findAll().then(data => {
    res.status(200).json({
      categories: data
    });
  }).catch(err => {
    console.log(err);

    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  })
});

// fetch category api
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const categoryDoc = await Category.findByPk(categoryId);

    if (!categoryDoc) {
      return res.status(404).json({
        message: 'No Category found.'
      });
    }

    res.status(200).json({
      category: categoryDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/:id', auth, role.checkRole(role.ROLES.Admin), async (req, res) => {
  const categoryId = req.params.id;
  const { category } = req.body;

  Category.update({ ...category }, {
    where: { id: categoryId }
  }).then(num => {
    if (num == 1) {

      res.status(200).json({
        success: true,
        message: 'Category has been updated successfully!'
      });
    }else{
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }).catch(error => {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  })
});

router.put(
  '/:id/active',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    try {
      const categoryId = req.params.id;
      const update = req.body.category && req.body.category.isActive == true ? 1 : 0;
      const categoryUpdated = await Category.update({ isActive: update },
        { where: { id: categoryId } });
      if (categoryUpdated == 1) {
        res.status(200).json({
          success: true,
          message: 'Category has been updated successfully!'
        });
      } else {
        res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }
    } catch (error) {
      console.log(error, 'error');

      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.delete(
  '/delete/:id',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    Category.destroy({ where: { id: req.params.id } }).then(num => {
      if (num == 1) {
        res.status(200).json({
          success: true,
          message: `Category has been deleted successfully!`,
          product
        });
      } else {
        res.send({
          error: 'Your request could not be processed. Please try again.'
        });
      }
    }).catch((error) => {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    })
  }
);

module.exports = router;
