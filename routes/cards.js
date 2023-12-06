const router = require('express').Router();
const {
  getAllCards, createCards, deleteCard, likeCard, dislikeCard,
} = require('../controller/cards');

router.get('/', getAllCards);
router.post('/', createCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
