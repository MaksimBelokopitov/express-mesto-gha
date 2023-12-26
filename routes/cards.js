const router = require('express').Router();
const { createCardsValidation, cardsIdValidation } = require('../middlewares/validation');
const {
  getAllCards, createCards, deleteCard, likeCard, dislikeCard,
} = require('../controller/cards');

router.get('/', getAllCards);
router.post('/', createCardsValidation, createCards);
router.delete('/:cardId', cardsIdValidation, deleteCard);
router.put('/:cardId/likes', cardsIdValidation, likeCard);
router.delete('/:cardId/likes', cardsIdValidation, dislikeCard);

module.exports = router;
