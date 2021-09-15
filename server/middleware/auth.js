// const passport = require('passport');

// const auth = passport.authenticate('jwt', { session: false });

// module.exports = auth;
const keys = require('../config/keys');
const { secret, tokenLife } = keys.jwt;
const jwt = require('jsonwebtoken');

const  auth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, secret, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}
module.exports = auth;