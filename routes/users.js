const router = require('express').Router();
const { getAllUsers, getUser, createUsers, updateUser, updateUserAvatar} = require('../controller/users.js');

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', createUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
