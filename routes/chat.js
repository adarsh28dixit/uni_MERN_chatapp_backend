var express = require('express');
const { createNewChat, findChat, userChatsById } = require('../controllers/chat')
const router = express.Router()

router.post('/newChat', createNewChat);
router.get('/userChatsById/:userId', userChatsById);
router.get('/find/:firstId/:secondId', findChat);

module.exports = router;