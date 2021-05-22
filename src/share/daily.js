const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_unitsCalendar = require('../../db/models/index').units_calendar;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_shareDaily_accumulated(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try {
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page

    // first, pick path info if request for path project
    let unitsCalendar = await _DB_unitsCalendar.findAll({
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
    let unitsListByDate = unitsCalendar.map((row, index)=>{
      assignedDate[row.id_unit] = row.assignedDate;
      return row.id_unit;
    });
    let unitsData = await _DB_units.findAll({
      where: {
        id: unitsListByDate
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
    let unitsObjList = [], unitsList =[]; // date sending back
    unitsListByDate.forEach((unitId, index) => {
      unitsObjList.push(
        {
          unitId: unitsData[unitId].exposedId,
          assignedDate: assignedDate[unitId]
        }
      );
      unitsList.push(unitsData[unitId].exposedId);
    });

    let sendingData = {
      unitsList: unitsList,
      unitsObjList: unitsObjList,
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };

    if (unitsObjList.length < 12) sendingData.scrolled = false;

    _res_success(res, sendingData, "GET: /share/daily/accumulated, complete.");

  }
  catch (error) {
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_GET_shareDaily_space(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try {
    // check if the user has reach the daily limit
    const reqD = new Date(parseInt(req.query.localTime));
    let allowedDate = new Date(reqD.toDateString());
    allowedDate.setDate(allowedDate.getDate() - 1); // allowed to 'yesterday'
    // then select by allowedDate
    let unitsCalendar = await _DB_unitsCalendar.findAll({
      where: {
        id_author: userId,
        author_identity: "user",
        assignedDate: {[Op.gte]: allowedDate}
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
    });

    let sendingData = {
      remainDate: [], // remained date, prepared
      temp: {}
    };
    if(unitsCalendar.length >= 2) sendingData.remainDate = false
    else sendingData.remainDate = true;

    _res_success(res, sendingData, "GET: /share/daily/space, complete.");

  }
  catch (error) {
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/accumulated', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/daily/accumulated ');
  _handle_GET_shareDaily_accumulated(req, res);
})

execute.get('/space', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/daily/space ');
  _handle_GET_shareDaily_space(req, res);
})

module.exports = execute;
