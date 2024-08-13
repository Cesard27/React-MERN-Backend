//  /api/events

const { Router } = require( 'express' );
const { check } = require('express-validator');

const { fieldValidator } = require('../middlewares/field-validator');
const { JWTValidator } = require('../middlewares/jwt-validator');
const { createEvent, deleteEvent, getEvents, updateEvent} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();
// val all with JWT
router.use( JWTValidator );

// Crud events
router.get('/', getEvents )

router.post(
   '/',
   [
      check('title', 'title is required').not().isEmpty(),
      check('start', 'start date is required').custom( isDate ),
      check('end', 'end date is required').custom( isDate ),
      fieldValidator,

   ], 
   createEvent );

router.put('/:id', updateEvent )

router.delete('/:id', deleteEvent )

module.exports = router;


