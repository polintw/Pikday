const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_unitsCalendar = require('../../db/models/index').units_calendar;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_node_FeedList(req, res){
  const userId = req.extra.tokenUserId;

  try{
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    const nodeId = req.query.nodeId;
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    const reqDayRange = !!req.query.dayRange ? req.query.dayRange : 'all';
    const currentTime = new Date();
    const currentDate = new Date(currentTime.toDateString());

    let unitsInRange = await _DB_attribution.findAll({
      where: {
        id_noun: nodeId
      },
      include: { //this is worked by comprehensive setting for 'association' --- foreign key between 2 including table(even a foreign key to self )
        model: _DB_unitsCalendar,
        // INNER JOIN, no 'required' set
        required: true,
        where: {
          assignedDate: (reqDayRange == 'today') ? currentDate : {[Op.lt]: currentDate},
          createdAt: {[Op.lt]: lastUnitTime},
        }
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
      limit: 12
    })
    .catch((err)=>{ throw new internalError(err ,131); });

    let unitsAssignedDate = {}, unitsIdAssignedDate = {};
    let unitsIdList = unitsInRange.map((row, index)=>{
      unitsIdAssignedDate[row.id_unit] = row.units_calendar.assignedDate;
      return row.id_unit;
    });
    //and we have to select from units for getting exposedId
    let unitsExposedList = await _DB_units.findAll({
        where: {
          id: unitsIdList
        },
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ]
      })
      .then((results)=>{
        let exposedIdlist = results.map((row, index)=>{
          unitsAssignedDate[row.exposedId] = unitsIdAssignedDate[row.id];
          return row.exposedId;
        });
        return exposedIdlist;
      })
      .catch((err)=>{ throw new internalError(err ,131); });

    let sendingData={
      unitsAssignedDate: {},
      unitsList: [],
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };

    if(unitsExposedList.length < 12 ) sendingData.scrolled = false;
    sendingData.unitsList = unitsExposedList;
    sendingData.unitsAssignedDate = unitsAssignedDate;

    _res_success(res, sendingData, "GET: nouns/accumulated, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: nouns/accumulated.');
  _handle_GET_node_FeedList(req, res);
})

module.exports = execute;
