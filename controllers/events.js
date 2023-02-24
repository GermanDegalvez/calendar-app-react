const { response, json } = require('express');
const Evento = require('../models/Evento');

const getEvents = async( req, res = response ) =>{

    const eventos = await Evento.find()
                                .populate( 'user', 'name' ); //mas campos --> 'name password email'

    res.json({
        ok: true,
        eventos
    })

};

const createEvent = async( req, res = response ) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid
        const savedEvent = await evento.save()

        res.json({
            ok: true,
            event: savedEvent
        })
        
    } catch (error) {
        console.log(error)
        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};

const updateEvent = async( req, res = response ) =>{

    const eventId = req.params.id;
    const uid = req.uid; 

    try {

        const event = await Evento.findById( eventId );

        if ( !event ) {
            return res.status( 404 ).json({
                ok: false,
                msg: 'No existe evento con el id solicitado'
            })
        }

        if ( event.user.toString() !== uid) {
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene autorizacion para modificar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Evento.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json({
            ok: true,
            evento: updatedEvent
        })
        
    } catch (error) {
        console.log(error);
        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

};

const deleteEvent = async( req, res = response ) =>{

    const eventId = req.params.id;
    const uid = req.uid; 

    try {

        const event = await Evento.findById( eventId );

        if ( !event ) {
            return res.status( 404 ).json({
                ok: false,
                msg: 'No existe evento con el id solicitado'
            })
        }

        if ( event.user.toString() !== uid) {
            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene autorizacion para eliminar este evento'
            })
        }

        const deletedEvent = await Evento.findByIdAndDelete( eventId );

        res.json({
            ok: true,
            evento: deletedEvent
        })
        
    } catch (error) {
        console.log(error);
        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

};


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}