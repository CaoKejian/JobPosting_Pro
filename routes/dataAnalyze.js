var express = require('express');
const axios = require('axios')
var router = express.Router();

router.get('/week/frequency', async function (req, res, next) {
  const { time, name } = req.query;
  const apiUrl = `http://127.0.0.1:3001/student/week?time=${time}&name=${name}`;

  try {
    const response = await axios.get(apiUrl);
    const responseData = response.data;
    console.log(responseData)
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'error' });
  }
});


module.exports = router;
