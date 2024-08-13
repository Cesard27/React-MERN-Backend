const { response, json } = require('express');
const jwt = require('jsonwebtoken');

const JWTValidator = ( req, res = response, next ) => {

   // x_token headers
   const token = req.header('x_token');

   if ( !token ) return res.status(401).json({
      ok: false,
      mag: 'no token in request'
   });

   try {
      
      const { uid, name } = jwt.verify(
         token,
         process.env.SECRET_JWT_SEED
      );

      req.uid = uid;
      req.name = name;

   } catch (error) {
      return res.status(401),json({
         ok: false,
         msg: 'Unvalid token'
      })
   }

   next();
}

module.exports = {
   JWTValidator
}