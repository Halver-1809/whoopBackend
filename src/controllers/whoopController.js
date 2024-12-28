const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto'); // Para generar un valor aleatorio para el estado
require('dotenv').config();

const getRedirectUri = (req) => {
  const isLocalhost = req.headers.host.includes('localhost');
  return isLocalhost ? process.env.REDIRECT_URI_LOCAL : process.env.REDIRECT_URI_NETWORK;
};

const getFrontendUrl = (req) => {
  const isLocalhost = req.headers.host.includes('localhost');
  return isLocalhost ? process.env.FRONTEND_URL_LOCAL : process.env.FRONTEND_URL_NETWORK;
};

// Controlador para manejar la ruta /authenticate
exports.authenticate = (req, res) => {
  const state = crypto.randomBytes(16).toString('hex'); // Genera un estado de 32 caracteres hexadecimales
  const redirectUri = getRedirectUri(req);

  const authUrl = process.env.AUTH_URL + '?' + querystring.stringify({
    client_id: process.env.CLIENT_ID,
    redirect_uri: redirectUri, // Usa la URI correspondiente
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
      return res.status(400).send('El parámetro "state" es inválido.');
    }

    const redirectUri = getRedirectUri(req);

    const tokenResponse = await axios.post(process.env.TOKEN_URL, querystring.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }));

    const accessToken = tokenResponse.data.access_token;

    const frontendUrl = getFrontendUrl(req);
    res.redirect(`${frontendUrl}/#/pages/dashboard?token=${accessToken}`);
  } catch (error) {
    console.error('Error en el callback:', error.message);
    res.status(500).send('Error al procesar la autenticación.');
  }
};
