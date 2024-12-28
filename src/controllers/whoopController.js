const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto'); // Para generar un valor aleatorio para el estado
require('dotenv').config();

// Controlador para manejar la ruta /authenticate
exports.authenticate = (req, res) => {
  const state = crypto.randomBytes(16).toString('hex'); // Genera un estado de 32 caracteres hexadecimales

  const authUrl = process.env.AUTH_URL + '?' + querystring.stringify({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI, // Asegúrate de usar process.env.REDIRECT_URI
    response_type: 'code',
    scope: 'read:recovery read:cycles read:workout read:sleep read:profile read:body_measurement',
    state: state, // Agrega el parámetro state
  });

  res.redirect(authUrl);
};

exports.callback = async (req, res) => {
  try {
      const code = req.query.code;
      const state = req.query.state;

      if (!state || state.length < 8) {
          console.error('Estado inválido o ausente:', state);
          return res.status(400).send('El parámetro "state" es inválido.');
      }

      console.log('Code recibido:', code);
      console.log('State recibido:', state);

      const tokenResponse = await axios.post(process.env.TOKEN_URL, querystring.stringify({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: 'authorization_code',
      }), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const accessToken = tokenResponse.data.access_token;
      console.log('Access Token recibido:', accessToken);

      if (!accessToken) {
          throw new Error('No se recibió access token en la respuesta del servidor.');
      }

      res.redirect(`http://localhost:5173/#/pages/dashboard?token=${accessToken}`);
  } catch (error) {
      console.error('Error en el callback:', error.response?.data || error.message);
      res.status(500).send('Error al procesar la autenticación.');
  }
};

