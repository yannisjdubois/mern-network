const express = require('express');
require('dotenv').config({path: './config/.env'}) // configuration du chemin pour aller vers les variables d'environnement
const app = express();

app.listen(5000, () => {
    console.log('Listening on port 5000');
})