const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const userToken = req.cookies.jwt;

  if (!userToken) {
    next(new AuthError('Необходима регистрация.'));
  }

  let payload;

  try {
    payload = jwt.verify(userToken, 'b60b577e13b7ce0028460bd0c1d801af047fc15fda28978766efeaa82a8d26df');
  } catch (err) {
    next(new AuthError('Необходима регистрация.'));
  }
  req.user = payload;
  next();
};
