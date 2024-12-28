const axios = require('axios');

// Función para intercambiar el código de autorización por un token de acceso
exports.getAccessToken = async (authorizationCode) => {
  try {
    const response = await axios.post(process.env.TOKEN_URL, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: authorizationCode,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error('Error al obtener el token de acceso: ' + error.message);
  }
};
