const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'}); // configuration du chemin pour aller vers les variables d'environnement
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();



app.use(bodyParser.json()); // Lecture du body
app.use(bodyParser.urlencoded({extended: true})); // Lecture des l'URL
app.use(cookieParser()); // Lecture des cookieParser


// JWT
app.get('*', checkUser); // Quelque soit la route, le middleware checkUser vérifie si l'utilisateur a un jeton qui correspond à un ID
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});


// Routes (middlewares)
app.use('/api/user', userRoutes)





// Server (toujours en bas)
app.listen(process.env.PORT, () => {
    console.log(`Listening on port : ${process.env.PORT}`);
})