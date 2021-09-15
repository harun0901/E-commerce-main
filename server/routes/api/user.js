const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
// const User = require('../../models/user');
// const Brand = require('../../models/brand');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

const db = require("../../models");
const User = db.user;

// search users api
router.get(
  '/list',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    try {
      const { search } = req.query;
      let Op = db.Sequelize.Op;
      let where = {};
      if (search.trim() != '') {
        where = {
          [Op.or]: [
            { firstName: { [Op.like]: '%' + search + '%' } },
            { lastName: { [Op.like]: '%' + search + '%' } },
            { email: { [Op.like]: '%' + search + '%' } }
          ]
        }
      }

      const users = await User.findAll({ where , attributes: {
        exclude: ['password','resetPasswordToken','resetPasswordExpires']
      }})

      res.status(200).json({
        users
      });
    } catch (error) {
      console.log(error, 'error is the');
      res.status(400).json({

        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    console.log(req.user, 'req.user req.user');

    const { id } = req.user;

    const userDoc = await User.findByPk(id, {
      attributes: {
        exclude: ['password','resetPasswordToken','resetPasswordExpires']
      }
    });

    res.status(200).json({
      user: userDoc
    });
  } catch (error) {
    console.log(error, 'error is the');

    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

router.put('/', auth, async (req, res) => {
  const user = req.user.id;
  const update = req.body.profile;

  User.update(update, { where: { id: user } }).then(updated => {
    if (updated == 1) {
      res.status(200).json({
        success: true,
        message: 'Your profile is successfully updated!',
      });
    } else {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }).catch((error) => {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  })
});


router.put('/merchantRequest', auth, async (req, res) => {
  const { id } = req.user;

  User.update({ merchantRequest: 1 }, { where: { id: id } }).then(updated => {
    if (updated == 1) {
      res.status(200).json({
        success: true,
        message: 'Your Request Submited Successfuly!',
      });
    } else {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }).catch((error) => {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  })
});

router.put('/update-to-merchant/:id', auth, role.checkRole(role.ROLES.Admin), async (req, res) => {
  const { id } = req.params;

  User.update({ role: role.ROLES.Merchant,merchantRequest:0  }, { where: { id: id } }).then(updated => {
    if (updated == 1) {
      res.status(200).json({
        success: true,
        message: 'Updated Successfuly!',
      });
    } else {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }).catch((error) => {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  })
});



module.exports = router;
