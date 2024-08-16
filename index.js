const path = require( 'path' );

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();
//express server
const app = express();

//db
dbConnection();

//cors
app.use(cors());

//Public directory
app.use( express.static('public') );

// body read 'n' parse
app.use( express.json() );

//routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

app.use( '*', ( req, res) => {
   res.sendFile( path.join( __dirname, 'public/index.html' ));
});


app.listen(process.env.PORT, () => {
   console.log(`running server in  ${process.env.PORT}`)
});

