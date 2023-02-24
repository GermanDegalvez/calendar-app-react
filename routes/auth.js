// Rutas de Usuarios / Auth
// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, renewToken,  } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/jwt-validate');

router.post(
    '/new', //primera argumento la ruta
    [//segundo argumento defino middlewares, o un arreglo de middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El pasword tener 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    createUser //tercer argumento la funcion que se ejecuta en dicha ruta
);


router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El pasword tener 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    loginUser)

router.get('/renew', validateJWT, renewToken)


module.exports = router;
