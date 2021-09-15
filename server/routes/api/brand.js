const express = require('express');
const router = express.Router();

const db = require("../../models");


// Bring in Models & Helpers
const Brand = db.brand;
const Product = db.product;
const Op = db.Sequelize.Op;
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const store = require('../../helpers/store');
const upload = require('../../middleware/upload')

router.post(
  '/add',
  auth,
  role.checkRole(role.ROLES.Admin),
  upload.single('image'),
  async (req, res) => {
    try {
      const name = req.body.name;
      const description = req.body.description;
  const imageUrl = req.file ? req.file.filename : '';
  const isActive = req.body.isActive;

      if (!description || !name) {
        return res
          .status(400)
          .json({ error: 'You must enter description & name.' });
      }

      const brand = {
        name,
        description,
        isActive,
        imageUrl
      }

      Brand.create(brand)
        .then(data => {
          res.status(200).json({
            success: true,
            message: `Brand has been added successfully!`,
            brand: data
          });
          // res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Tutorial."
          });
        });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// fetch store brands api
router.get('/list', async (req, res) => {

  Brand.findAll()
    .then(data => {
      res.status(200).json({
        brands: data
      });
      // res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while geting Data."
      });
    });
});

// fetch brands api
router.get(
  '/',
  auth,
  role.checkRole(role.ROLES.Admin), (req, res) => {
    Brand.findAll().then(brands => {
      res.status(200).json({
        brands
      });
    }).catch((error) => {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    })
  });

router.get('/:id', async (req, res) => {
  try {
    const brandId = req.params.id;

    Brand.findByPk(brandId)
      .then(data => {
        res.status(200).json({ brand: data });
      })
      .catch(err => {
        res.status(500).send({
          message: "Internal server error"
        });
      });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.get(
  '/list/select',
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      let brands = null;

      if (req.user.merchant) {
        brands = await Brand.findAll(
          {where:{
            merchant: req.user.merchant
          }},
        );
      } else {
        brands = await Brand.findAll({}, 'name');
      }

      res.status(200).json({
        brands
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.put(
  '/:id',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    try {
      const brandId = req.params.id;
      const update = req.body.brand;
      const query = { id: brandId };

      Brand.update(update, { where: query }).then(isUpdated => {
        if (isUpdated == 1) {
          res.status(200).json({
            success: true,
            message: 'Brand has been updated successfully!'
          });
        } else {
          res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
          });
        }
      })
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.put(
  '/:id/active',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    try {
      const {id} = req.params;
      const update = req.body.brand && req.body.brand.isActive == true ? 1 : 0; 

       Brand.update({isActive: update}, {where:{id}}).then(isUpdated=>{
        if(isUpdated ==1){
          res.status(200).json({
            success: true,
            message: 'Brand has been updated successfully!'
          });
        }else{
          res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
          });
        }
      })
    } catch (error) {
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
      await Brand.destroy({where:{ id: req.params.id }}).then(async isDeleted=>{
        if(isDeleted ==1){
         await Product.destroy({where:{ brand: req.params.id }})
          res.status(200).json({
            success: true,
            message: `Brand has been deleted successfully!`,
            
          });
        }else{
          res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
          });
        }
      }).catch(err =>{
        res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      })
  }
);

module.exports = router;
