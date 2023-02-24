const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/jwt-validate');


//KMiddleware por el que pasan todas las rutas que se definan abajo
router.use( validateJWT );

 
router.get( '/', getEvents)

router.post( 
    '/', 
    [
        check( 'title', 'El titulo es obligatorio').not().isEmpty(),
        check( 'start', 'Fecha de inicio obligatoria').custom( isDate ),
        check( 'end', 'Fecha final obligatoria').custom( isDate ),
        fieldValidator
    ], 
    createEvent
)

router.put( 
    '/:id', 
    [
        check( 'title', 'El titulo es obligatorio').not().isEmpty(),
        check( 'start', 'Fecha de inicio obligatoria').custom( isDate ),
        check( 'end', 'Fecha final obligatoria').custom( isDate ),
        fieldValidator
    ], 
    updateEvent
)

router.delete( '/:id', deleteEvent)

module.exports = router;