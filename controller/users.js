const User = require('../models/user.js');

const handleError = (res, err) => {
  res.status(500).send({ message: err.message });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ users }))
    .catch(err => handleError(res, err));
};

module.exports.getUser = (req, res) => {
  const {userId} = req.params;
  User.findById(userId)
    .then((user) => {
      if(!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.'})
      };
      res.status(200).send({ data: user});
    })
    .catch((err) => {
      if(err.name === "CastError"){
        return res.status(400).send({ message: 'Переданы некорректные _id пользователя.'})
      }
      handleError(res, err)
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar} = req.body;

  User.create({ name, about,  avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.'})
      };
      handleError(res, err);
    });
};

module.exports.updateUser = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {
    new: true,
    runValidators: true
  })
    .then((user) => {
      if(!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.'})
      };
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      if(err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля'})
      };
      handleError(res, err);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {
    new: true,
    runValidators: true
  })
    .then((user) => {
      if(!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.'})
      };
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      if(err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара'})
      };
      handleError(res, err);
    });
};


