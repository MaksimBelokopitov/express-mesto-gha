const { celebrate, Joi } = require('celebrate');

const linkReg = /^(https?:\/\/)?[\w-]{1,30}\.([\w]{1,30}[^\s@]*$)/m;

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkReg),
  }),
});

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkReg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.createCardsValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkReg),
  }),
});

module.exports.cardsIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

module.exports.usersIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});
