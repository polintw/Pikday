const express = require('express');
const router = express.Router();

const path = require("path");
const {convertToRaw, convertFromRaw} = require ('draft-js');

const { envServiceGeneral, envImgPath} = require('../config/.env.json');
const winston = require('../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../db/models/index').units;
const _DB_users = require('../db/models/index').users;
const _DB_nouns = require('../db/models/index').nouns;
const _DB_attribution = require('../db/models/index').attribution;
const projectRootPath = require('../projectRootPath');
const {_res_success} = require('./utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('./utils/reserrHandler.js');

/*
_handle_crawler_GET_Unit() was remaining from Cornerth.
keep to remind the possibility of independent Unit url
*/
async function _handle_crawler_GET_Unit(req, res){
  //select Unit by id in query
  //already validate before pass to this handler

}

//route pass from parent start from here

//res common data to crawler if no specific destination,
//must at the last to assure filtering by any specific path above
router.use('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`${'from crawler, GET: '} ${req.originalUrl}`);
  const variables= { //create local variable as value used in template
    title: "Cornerth.",
    descrip: "Uncover what behind.",
    ogurl: req.originalUrl,
    ogimg: "https://" + envServiceGeneral.appDomain + '/router/img/' + envImgPath.file_previewApp  //replace to page icon in the future
  };

  res.render(path.join(projectRootPath, '/public/html/ren_crawler.pug'), variables);
})

module.exports = router;
