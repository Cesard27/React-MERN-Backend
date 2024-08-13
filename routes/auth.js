// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { newUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { JWTValidator } = require('../middlewares/jwt-validator');

router.post(
   '/new', 
   [// middlewares
      check('name', 'name obligatory').not().isEmpty(),
      check('email', 'email is obligatory').isEmail(),
      check('password', 'password need at least 6 characters').isLength({ min: 6 }),
      fieldValidator
   ], 
   newUser
);
router.post(
   '/', 
   [
      check('email', 'email is obligatory').isEmail(),
      check('password', 'password need at least 6 characters').isLength({ min: 6 }),
      fieldValidator
   ],
   loginUser
);


router.get('/renew', JWTValidator, renewToken);

module.exports = router;