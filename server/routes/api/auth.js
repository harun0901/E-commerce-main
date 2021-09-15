const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');

const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
// Bring in Models & Helpers
// const User = require('../../models/user');
const mailgun = require('../../services/mailgun');
const keys = require('../../config/keys');


const db = require("../../models");
const User = db.user;

const { secret, tokenLife } = keys.jwt;

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    return res.status(400).json({ error: 'You must enter an email address.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'You must enter a password.' });
  }

  User.findOne({where:{ email }}).then(user => {
    if (!user) {
      return res
        .status(400)
        .send({ error: 'No user found for this email address.' });
    }

    if (!user) {
      return res
        .status(400)
        .send({ error: 'No user found for this email address.' });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        };

        jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            user: payload
          });
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Password Incorrect'
        });
      }
    });
  });
});

router.post('/register', (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const userRole = role.ROLES.Customer;

  if (!email) {
    return res.status(400).json({ error: 'You must enter an email address.' });
  }

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'You must enter your full name.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'You must enter a password.' });
  }

  User.findOne({
    where: { email: email }
  }).then(async (data) => {
    if (data) {
      return res
        .status(400)
        .json({ error: 'That email address is already in use.' });
    }
console.log(data, 'data i sthe');

    let subscribed = false;
    const user = {
      email,
      password,
      firstName,
      lastName,
      role:userRole
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
          });
        }

        user.password = hash;

        User.create(user).then(resp => {

          const payload = {
            id: resp.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }
          console.log(resp, 'user create');
          

          // await mailgun.sendEmail(user.email, 'signup', null, user.profile);

          jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
            res.status(200).json({
              success: true,
              subscribed,
              token: `Bearer ${token}`,
              user: payload
            });
          });
        }).catch(error =>{
          if (error) {
            return res.status(400).json({
              error: 'Your request could not be processed. Please try again.'
            });
          }

        })
      });
    });
  }).catch(err=>{
    if (err) {
      console.log(err, 'err');
      
      next(err);
    }
  })
});

router.post('/forgot', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'You must enter an email address.' });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err || existingUser === null) {
      return res.status(400).json({
        error:
          'Your request could not be processed as entered. Please try again.'
      });
    }

    crypto.randomBytes(48, (err, buffer) => {
      const resetToken = buffer.toString('hex');
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = Date.now() + 3600000;

      existingUser.save(async err => {
        if (err) {
          return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
          });
        }

        await mailgun.sendEmail(
          existingUser.email,
          'reset',
          req.headers.host,
          resetToken
        );

        res.status(200).json({
          success: true,
          message:
            'Please check your email for the link to reset your password.'
        });
      });
    });
  });
});

router.post('/reset/:token', (req, res) => {
  const password = req.body.password;

  if (!password) {
    return res.status(400).json({ error: 'You must enter a password.' });
  }

  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    (err, resetUser) => {
      if (!resetUser) {
        return res.status(400).json({
          error:
            'Your token has expired. Please attempt to reset your password again.'
        });
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return res.status(400).json({
              error:
                'Your request could not be processed as entered. Please try again.'
            });
          }
          req.body.password = hash;

          resetUser.password = req.body.password;
          resetUser.resetPasswordToken = undefined;
          resetUser.resetPasswordExpires = undefined;

          resetUser.save(async err => {
            if (err) {
              return res.status(400).json({
                error:
                  'Your request could not be processed as entered. Please try again.'
              });
            }

            await mailgun.sendEmail(resetUser.email, 'reset-confirmation');

            res.status(200).json({
              success: true,
              message:
                'Password changed successfully. Please login with your new password.'
            });
          });
        });
      });
    }
  );
});

router.post('/reset', auth, (req, res) => {
  const email = req.user.email;
  const password = req.body.password;

  if (!password) {
    return res.status(400).json({ error: 'You must enter a password.' });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err || existingUser === null) {
      return res.status(400).json({
        error:
          'Your request could not be processed as entered. Please try again.'
      });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          return res.status(400).json({
            error:
              'Your request could not be processed as entered. Please try again.'
          });
        }
        req.body.password = hash;

        existingUser.password = req.body.password;

        existingUser.save(async err => {
          if (err) {
            return res.status(400).json({
              error:
                'Your request could not be processed as entered. Please try again.'
            });
          }

          await mailgun.sendEmail(existingUser.email, 'reset-confirmation');

          res.status(200).json({
            success: true,
            message:
              'Password changed successfully. Please login with your new password.'
          });
        });
      });
    });
  });
});

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force'
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };

    jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
      const jwt = `Bearer ${token}`;

      const htmlWithEmbeddedJWT = `
    <html>
      <script>
        // Save JWT to localStorage
        window.localStorage.setItem('token', '${jwt}');
        // Redirect browser to root of application
        window.location.href = '/auth/success';
      </script>
    </html>       
    `;

      res.send(htmlWithEmbeddedJWT);
    });
  }
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['public_profile', 'email']
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    const payload = {
      id: req.user.id
    };

    jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
      const jwt = `Bearer ${token}`;

      const htmlWithEmbeddedJWT = `
    <html>
      <script>
        // Save JWT to localStorage
        window.localStorage.setItem('token', '${jwt}');
        // Redirect browser to root of application
        window.location.href = '/auth/success';
      </script>
    </html>       
    `;

      res.send(htmlWithEmbeddedJWT);
    });
  }
);

module.exports = router;
