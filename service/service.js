const axios = require('axios');
const querystring = require('querystring');
const instance = axios.create({
  baseURL: 'http://127.0.0.1:3001'
})
const http = {
  async get(url, params) {
    try {
      const response = await instance.get(url, {
        params: params
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async post(url, data) {
    try {
      const response = await instance.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = http