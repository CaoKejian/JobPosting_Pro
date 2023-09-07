var express = require('express');
const axios = require('axios');
const http = require('../service/service');
var router = express.Router();

router.get('/week/frequency', async function (req, res, next) {
  const { time, name } = req.query;
  const apiUrl = `http://127.0.0.1:3001/student/week`;
  try {
    const res = await http.get(apiUrl, { time, name })
    res.json(res);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'python request is failed' });
  }
});


module.exports = router;
