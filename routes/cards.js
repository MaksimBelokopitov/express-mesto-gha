const router = require('express').Router();
const { createCardsValidation } = require('../middlewares/validation');
const {
  getAllCards, createCards, deleteCard, likeCard, dislikeCard,
} = require('../controller/cards');

router.get('/', getAllCards);
router.post('/', createCardsValidation, createCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
