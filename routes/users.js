const router = require('express').Router();
const {
  getAllUsers, getUser, updateUser, updateUserAvatar, getActiveUser,
} = require('../controller/users');
const { updateUserValidation, updateAvatarValidation, usersIdValidation } = require('../middlewares/validation');

router.get('/', getAllUsers);
router.get('/me', getActiveUser);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);
router.get('/:userId', usersIdValidation, getUser);

module.exports = router;
