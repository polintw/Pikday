const express = require('express');
const execute = express.Router();

const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_attribution = require('../../db/models/index').attribution;

function _handle_GET_unitsByList(req, res){
  const userId = req.extra.tokenUserId;

  new Promise((resolve, reject)=>{
    //in this api, units list was passed from client,
    //we choose directly by that list, but Remember! limit the amount
    let unitsList = req.query.unitsList; //list was composed of 'exposedId'

    _DB_units.findAll({
      where: {
        exposedId: unitsList
      },
      limit: 64 //set limit to prevent api abuse, currently the longer list would be passed from NodesFilter, 64 is actually not enough
    }).then((result)=>{
      let sendingData={
        unitsBasic: {},
        nounsListMix: [],
        temp: {
          chart: {},
          unitpm: []
        }
      }

      result.forEach((row, index)=>{
        sendingData.unitsBasic[row.exposedId] = {
          unitsId: row.exposedId,
          pic_layer0: row.url_pic_layer0,
          pic_layer1: row.url_pic_layer1,
          createdAt: row.createdAt,
          nounsList: []
        };
        //Now it's Important! We have to build a 'map' between unitid & exposedId
        sendingData.temp['chart'][row.id] = row.exposedId;
        sendingData.temp.unitpm.push(row.id); //push the internal id to form a list
      });

      return sendingData;
    }).then((sendingData)=>{
      conditionAttri = {
        where: {id_unit: sendingData.temp.unitpm},
        attributes: ['id_unit', 'id_noun'],
      };

      let attriSelection = Promise.resolve(_DB_attribution.findAll(conditionAttri).catch((err)=>{throw err}));

      return Promise.all([attriSelection])
      .then(([resultsAttri])=>{
        /*
        Remember composed all unitsBasic related data by exposedId
        */
        resultsAttri.forEach((row, index)=> {
          let currentExposedId = sendingData.temp['chart'][row.id_unit];
          sendingData.unitsBasic[currentExposedId]["nounsList"].push(row.id_noun);
          //and push it into nounsListMix, but remember to avoid duplicate
          if(sendingData.nounsListMix.indexOf(row.id_noun)< 0) sendingData.nounsListMix.push(row.id_noun);
        });

        // return sendingData; remaining from old version
        resolve(sendingData);
      });
    }).catch((err)=>{ //catch the error came from the whole
      reject(err);
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET units: plain, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};

execute.get('/', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET: units /numerous.');
  _handle_GET_unitsByList(req, res);
})

module.exports = execute;
