const express = require('express');
const mongoose = require('mongoose');
const ViewCount = require('./model.js');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const port = parseInt(process.env.PORT, 10) || 3000

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
  } catch (error) {
    throw Error('[Error connecting to database] ' + error);
  }
}

app.listen(port, async () => {
  try {
    await connectDB();
    console.log('Connected to database.');
  } catch (error) {
    console.log(error);
    return;
  }
  console.log('Server listening on port ' + port);
})

/**
 * The root. 
 * Get and respond with the current day's comic in json format.
 */
app.get('/', async (_, res) => {
  res.setHeader('Content-Type', 'application/json');

  let resContent;
  try {
    const res = await axios.get(process.env.XKCD_ROOT + '/info.0.json');
    resContent = res.data;
    console.log('[Response on route \'/\']', resContent);
  } catch (error) {
    console.log('[Error on route \'/\']', error.data);
    res.status(500).send({ "error": "Could not fetch from xkcd API." });
    return;
  }

  let viewCount;
  try {
    viewCount = await incrementRecordGetViewCount(resContent.num);
    resContent.view_count = viewCount;
  } catch (error) {
    console.log(error);
    res.status(500).send({ "error": "Could not access database for view count." });
    return;
  }

  res.status(200).send(resContent);
});

/**
 * /[number]
 * Get and respond with the numbered comic in json format.
 * Examples:
 *  /1
 *  /999
 */
app.get('/:number', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const num = req.params.number;
  if (isNaN(num)) {
    res.status(404).send()
    return;
  }

  let resContent;
  try {
    const res = await axios.get(process.env.XKCD_ROOT + '/' + num + '/info.0.json');
    resContent = res.data;
    console.log('[Response on route \'/' + num + '\']', resContent);
  } catch (error) {
    console.log('[Error on route \'/' + num + '\']', error.data);
    res.status(500).send({ "error": "Could not fetch from xkcd API." });
    return;
  }

  let viewCount;
  try {
    viewCount = await incrementRecordGetViewCount(resContent.num);
    resContent.view_count = viewCount;
  } catch (error) {
    console.log(error);
    res.status(500).send({ "error": "Could not access database for view count." });
    return;
  }

  res.status(200).send(resContent);
});

/**
 * Find a record from the database based on the comic number.
 * Increment the viewCount of the record.
 * Retrieve the updated record.
 * Return the viewCount.
 * @param {Number} num the comicNum of the record to update and retrieve. 
 * @returns the updated viewCount of the record.
 */
async function incrementRecordGetViewCount(num) {
  try {
    const doc = await ViewCount.findOneAndUpdate(
      { comicNum: num },
      { $inc: { viewCount: 1 } },
      {
        new: true,
        upsert: true
      }
    );
    return doc.viewCount;
  } catch (error) {
    throw Error('[Error accessing database] ' + error);
  }
}