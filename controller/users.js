const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const EmailError = require('../errors/EmailError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные '));
      } else {
        next(err);
      }
    });
};

module.exports.createUsers = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.status(201).send({
          name, about, avatar, email,
        }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new EmailError('Пользователь с указанным почтой уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные '));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return;
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные '));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'b60b577e13b7ce0028460bd0c1d801af047fc15fda28978766efeaa82a8d26df', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getActiveUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};
