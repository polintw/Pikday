const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_attribution = require('../../../db/models/index').attribution;
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
    let d = new Date();
    let reqDate = !!req.query.dateString ? req.query.dateString : d.toDateString();

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

    _res_success(res, sendingData, "GET: /feed/daily/accumulated, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_GET_feed_DailyNodes(req, res){
  const userId = req.extra.tokenUserId;

  try{
    let reqBaseTime = new Date(req.query.basedTime);
    const selectionBasedTime = !isNaN(reqBaseTime) ? reqBaseTime : new Date(); // basically, undefined listUnitBase means first landing to the page
    // the 'day' we focus, use the 'date to the machine' as standard one
    let d = new Date();
    let reqDate = !!req.query.dateString ? req.query.dateString : d.toDateString();

    // first, select 'today' units from units_calendar
    let unitsToday = await _DB_unitsCalendar.findAll({
      where: {
        assignedDate: reqDate,
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
    });
    // turn into unitsList from result
    let earliestUnitTime = null;
    let unitsList = unitsToday.map((row, index)=>{
      if(index == (unitsToday.length -1) ) earliestUnitTime = row.createdAt;
      return row.id_unit;
    });
    // then select nodes for those units
    let nodesByUnits = await _DB_attribution.findAll({
      where: {
        id_unit: unitsList
      },
      attributes: ['id_noun'], // otherwise the 'group' beneath would be limit by other attributes like 'createdAt'
      group: 'id_noun' //Important. means we combined the rows by node, each id_noun would only has one row
    });
    let nodesList = nodesByUnits.map((row, index)=>{
      return row.id_noun;
    });

    let sendingData={
      nodesList: [],
      nextFetchBasedTime: earliestUnitTime,
      scrolled: false, // currently, we send all nodes in 'one' time
      temp: {}
    };
    sendingData.nodesList = nodesList;

    _res_success(res, sendingData, "GET: /feed/daily/nodes, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/accumulated', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /feed/daily/accumulated.');
  _handle_GET_feed_Daily(req, res);
})

execute.get('/nodes', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /feed/daily/nodes.');
  _handle_GET_feed_DailyNodes(req, res);
})

module.exports = execute;
