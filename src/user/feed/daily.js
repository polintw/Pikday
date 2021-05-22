const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_unitsCalendar = require('../../../db/models/index').units_calendar;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../../utils/reserrHandler.js');

async function _handle_GET_feed_Daily(req, res){
  const userId = req.extra.tokenUserId;

  try{
    //we are going to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // the 'day' we focus, use the 'date to the machine' as standard one
    let reqDate = !!req.query.dayRange ? req.query.dayRange : "today";
    let d = new Date();
    if( reqDate == "today" ) reqDate = new Date(d.toDateString())
    else {
      d.setDate(d.getDate() -1);
      reqDate = new Date(d.toDateString());
    };
    // units id list res to client at final
    let unitsExposedList = [];

    // this api, limit to the dayRange passed from req.
    let unitsOnDate = await _DB_unitsCalendar.findAll({
      where: {
        assignedDate: reqDate,
        createdAt: {[Op.lt]: lastUnitTime}
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
      limit: 12
    });

    let unitsList = unitsOnDate.map((row, index)=>{
      return row.id_unit;
    });
    let unitsData = await _DB_units.findAll({
      where: {
        id: unitsList
      }
    });
    unitsExposedList = unitsData.map((row, index)=>{ return row.exposedId;});


    let sendingData={
      unitsList: [],
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };
    if(unitsExposedList.length < 12 ) sendingData.scrolled = false;
    sendingData.unitsList = unitsExposedList;

    _res_success(res, sendingData, "GET: /feed/daily, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /feed/daily.');
  _handle_GET_feed_Daily(req, res);
})

module.exports = execute;
