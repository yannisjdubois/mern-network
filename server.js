const express = require('express');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'}) // configuration du chemin pour aller vers les variables d'environnement
require('./config/db')
const app = express();




// Routes (middlewares)
app.use('/api/user', userRoutes)





// Server (toujours en bas)
app.listen(process.env.PORT, () => {
    console.log(`Listening on port : ${process.env.PORT}`);
})