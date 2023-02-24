const { response } = require('express')
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) =>{

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email })

        if ( usuario ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Ya existe un usuario con el correo ingresado'
            });
        }

        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generateJWT( usuario.id, usuario.name );

        res.status( 201 ).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
        
    }

}

const loginUser = async(req, res = response ) =>{

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email })

        if ( !usuario ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            });
        }

        //Confirmar contraseña
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {

            return res.status( 400 ).json({
                ok: false,
                msg: 'Credenciales incorrectas'
            })

        }

        //Generar JWT
        const token = await generateJWT( usuario.id, usuario.name );

        res.status( 200 ).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
        
    }

}

const renewToken = async(req, res = response ) =>{

    const { uid, name } = req;

    const token = await generateJWT( uid, name );
    
    res.json({
        ok: true,
        token
    })

}



module.exports = {
    createUser,
    loginUser,
    renewToken,
}