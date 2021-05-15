const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_unitsCalendar = require('../../../db/models/index').units_calendar;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_accumulated_shareDaily(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try {
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page

    // first, pick path info if request for path project
    let unitsByDate = await _DB_unitsCalendar.findAll({
      where: {
        id_author: userId,
        author_identity: "user",
        createdAt: {[Op.lt]: lastUnitTime}
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
      limit: 12
    });

    let assignedDate = {};
    let unitsList = unitsByDate.map((row, index)=>{
      assignedDate[row.id_unit] = row.assignedDate;
      return row.id_unit;
    });
    let unitsData = await _DB_units.findAll({
      where: {
        id: unitsList
      }
    })
    .then((result)=> {
      let unitsDataObj = {};
      result.forEach((row, index) => {
        unitsDataObj[row.id] ={
          unitId: row.id,
          exposedId: row.exposedId,
          createdAt: row.createdAt
        }
      });
      return unitsDataObj;
    });

    let unitsObjList = [];
    unitsList.forEach((unitId, index) => {
      unitsObjList.push(
        {
          unitId: unitsData[unitId].exposedId,
          
        }
      )
    });



    let sendingData = {
      unitsList: [],
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };

    if (unitsExposedList.length < reqListLimit) sendingData.scrolled = false;
    sendingData.unitsList = unitsExposedList;

    _res_success(res, sendingData, "GET: /share/daily, complete.");

  }
  catch (error) {
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/daily', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/daily ');
  _handle_GET_accumulated_shareDaily(req, res);
})

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/accumulated ');
  _res_success(res, {temp: {}}, "GET: /paths/accumulated, complete.");
})

module.exports = execute;
