var express = require('express');
const {getUsers, createUser, signinUser, getUserById} = require('../controllers/user');
var router = express.Router();

/* GET users listing. */
router.get('/getAllUsers', getUsers);

router.get('/getUserById/:id', getUserById);

/* POST users registration*/
router.post('/signup', createUser)


/* POST users signin*/
router.post('/signin', signinUser)

module.exports = router;
