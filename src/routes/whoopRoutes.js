    const express = require('express');
    const router = express.Router();
    const whoopController = require('../controllers/whoopController');

    // Ruta para iniciar el flujo de autenticación
    router.get('/authenticate', whoopController.authenticate);

    // Ruta para manejar el callback después de la autorización
    router.get('/callback', whoopController.callback);


    module.exports = router;
