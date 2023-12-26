const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const UserRulesErrors = require('../errors/UserRulesError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        next(new UserRulesErrors('Нельзя удалять чужие карточки.'));
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ message: 'Вы удалили карточку' });
          });
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Карточка по указанному _id не найдена.'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные '));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(new NotFoundError('Карточка по указанному _id не найдена.'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные '));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        next(new NotFoundError('Карточка по указанному _id не найдена.'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные '));
      } else {
        next(err);
      }
    });
};
