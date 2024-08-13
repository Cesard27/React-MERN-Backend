const { response } = require('express');
const Event = require('../models/Event');

//! Get
const getEvents = async( req, res = response ) => {

   const events = await Event .find()
                              .populate('user', 'name');

   res.json({
      ok: true,
      events,
   })
}

//! Create
const createEvent = async( req, res = response ) => {

   const event = new Event( req.body );

   try {

      event.user = req.uid;
      
      const savedEvent = await event.save();

      res.json({
         ok: true,
         evet: savedEvent,
      })

   } catch (error) {
      res.status(500).json({
         ok: false,
         msg: 'contact with admin'
      })
   };
}

//! Update
const updateEvent = async( req, res = response ) => {

   const idEvent = req.params.id;
   const uid = req.uid;

   try {
      
      const event = await Event.findById( idEvent );

      ( !event ) && res.status(404).json({
         ok: false,
         msg: 'Event not found matching with id',
      });

      if ( event.user.toString() !== uid ) {
         return res.status(401).json({
            ok: false,
            msg: 'User do not possess privileges to perform this action',
         });
      }

      const newEvent = {
         ...req.body,
         user: uid
      }

      const updatedEvent = await Event.findByIdAndUpdate( idEvent, newEvent, { new: true } );

      res.json({
         ok: true,
         event: updatedEvent,
      })

   } catch (error) {
      res.status(500).json({
         ok: false,
         msg: 'contact with admin'
      })
   }
}

//! Delete
const deleteEvent = async( req, res = response ) => {
   const idEvent = req.params.id;
   const uid = req.uid;

   try {
      
      const event = await Event.findById( idEvent );

      ( !event ) && res.status(404).json({
         ok: false,
         msg: 'Event not found matching with id',
      });

      if ( event.user.toString() !== uid ) {
         return res.status(401).json({
            ok: false,
            msg: 'User do not possess privileges to perform this action',
         });
      }
      
      await Event.findByIdAndDelete( idEvent );

      res.json({
         ok: true,
      })

   } catch (error) {
      res.status(500).json({
         ok: false,
         msg: 'contact with admin'
      })
   }
}

module.exports = {
   getEvents,
   createEvent,
   updateEvent,
   deleteEvent,
}