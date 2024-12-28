const axios = require('axios');

// Función para intercambiar el código de autorización por un token de acceso
exports.getAccessToken = async (authorizationCode) => {
  try {
    const response = await axios.post(process.env.TOKEN_URL, querystring.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: authorizationCode,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    }));

    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('No access token found in the response');
    }
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw new Error('Error al obtener el token de acceso: ' + error.message);
  }
};
