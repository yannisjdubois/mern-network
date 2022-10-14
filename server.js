const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'}) // configuration du chemin pour aller vers les variables d'environnement
require('./config/db');
const app = express();



app.use(bodyParser.json()); // Lecture du body
app.use(bodyParser.urlencoded({extended: true})); // Lecture des l'URL
app.use(cookieParser()); // Lecture des cookieParser


// Routes (middlewares)
app.use('/api/user', userRoutes)





// Server (toujours en bas)
app.listen(process.env.PORT, () => {
    console.log(`Listening on port : ${process.env.PORT}`);
})