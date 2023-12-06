const Card = require('../models/card');

const handleError = (res, err) => {
  res.status(500).send({ message: err.message });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => handleError(res, err));
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      handleError(res, err);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then(() => {
      res.status(200).send({ message: 'Вы удалили карточку' });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные ' });
      } else {
        handleError(res, err);
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((result) => {
      res.status(200).send({ data: result });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные ' });
      } else {
        handleError(res, err);
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((result) => {
      res.status(200).send({ data: result });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные ' });
      } else {
        handleError(res, err);
      }
    });
};
