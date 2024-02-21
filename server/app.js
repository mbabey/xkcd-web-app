const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();

const port = parseInt(process.env.PORT, 10) || 3000

app.listen(port, () => {
  console.log('Server listening on port ' + port);
})

app.get('/', async (_, res) => {
  let resContent;
  console.log(process.env.XKCD_ROOT);
  try {
    resContent = await axios.get(process.env.XKCD_ROOT + '/info.0.json');
    resContent = await resContent.json();
    console.log('[Response on route \'/\']', resContent);
  } catch (error) {
    console.log('[Error on route \'/\']', error);
    res.status(500).send({ "error": "Could not fetch from xkcd API." });
    return
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(resContent);
});

app.get('/:number', async (req, res) => {
  const num = req.params.number;

  let resContent;
  try {
    resContent = await axios.get(process.env.XKCD_ROOT + '/' + num + '/info.0.json');
    resContent = await resContent.json();
    console.log('[Response on route \'/\']', resContent);
  } catch (error) {
    console.log('[Error on route \'/\']', error);
    res.status(500).send({ "error": "Could not fetch from xkcd API." });
    return
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(resContent);
});

async function getxkcd(num) {
  if (num) {

  }

}