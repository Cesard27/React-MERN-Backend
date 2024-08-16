const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWTGenerator } = require('../helpers/jwt');

//! NewUser
const newUser = async( req, res = response ) =>{

   const { email, password } = req.body;

   try {

      let user = await User.findOne({ email });

      if ( user ) {
         return res.status(400).json({
            ok: false,
            msg: 'email already exist'
         })
      }

      user = new User( req.body );

      // crypt pass
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync( password, salt );
      await user.save();

      // Generate JWT
      const token = await JWTGenerator( user.id, user.name );

      res.status(201).json({
         ok    : true,
         uid   : user.id,
         name  : user.name,
         token,
      });
   } catch (error) {
      console.log(error)
      res.status(500).json({
         ok: false,
         msg: 'talk to admin'
      });
   }
   
}

//! Login User
const loginUser = async( req, res = response ) =>{

   const { email, password } = req.body;

   try {

      let user = await User.findOne({ email });

      if ( !user ) {
         return res.status(400).json({
            ok: false,
            msg: 'wrong email/password'
         })
      }

      // password match
      const validPassword = bcrypt.compareSync( password, user.password );

      if ( !validPassword ) {
         return res.status(400).json({
            ok    : false,
            msg   : 'wrong password'
         })
      }

      // Generate JWT
      const token = await JWTGenerator( user.id, user.name );

      res.status(200).json({
         ok    : true,
         uid   : user.id,
         name  : user.name,
         token,
      });      
   } catch (error) {
      console.log(error)
      res.status(500).json({
         ok: false,
         msg: 'talk to admin'
      });
   }

   
}

//! Renew Token
const renewToken = async( req, res = response ) =>{

   const { uid, name } = req;

   // Generate JWT
   const token = await JWTGenerator( uid, name );

   res.json({
      ok: true,
      uid,
      name,
      token,
   }); 
}

//! Exports
module.exports = {
   newUser,
   renewToken,
   loginUser,
}