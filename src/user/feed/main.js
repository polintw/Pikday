const express = require('express');
const main = express.Router();

const dailyExecutive = require('./daily.js');

main.use('/daily', dailyExecutive)

module.exports = main;
