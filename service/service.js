const axios = require('axios');
const querystring = require('querystring');

const http = {
  async get(url, params) {
    const fullUrl = `${url}?${querystring.stringify(params)}`;
    try {
      const response = await axios.get(fullUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async post(url, data) {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = http