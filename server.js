const express = require('express');
require('dotenv').config({path: './config/.env'}) // configuration du chemin pour aller vers les variables d'environnement
const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Listening on port 5000 ${process.env.PORT}`);
})