const Jimp = require('jimp');
const isEmpty = require('../../utils/isEmpty');
const {selectNodesParent } = require('../../nouns/utils.js');
const {
  forbbidenError,
  internalError,
  notFoundError,
  validationError
} = require('../../utils/reserrHandler.js');
const _DB_users = require('../../../db/models/index').users;
const _DB_units = require('../../../db/models/index').units;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_unitsCalendar = require('../../../db/models/index').units_calendar;

async function validateDailyShared(modifiedBody, userId) {

  // checking is the author really exist
  const userInfo = await _DB_users.findOne({
    where: {id: userId}
  });
  if(!userInfo){ //null, means no user found
    throw new notFoundError("You are not an allowed author.", 50);
    return;
  };

  // checking if the user had uploaded any pic to the assignedDate
  let assignedDate = new Date(modifiedBody.assignedDate);
  let userInUnitCalendar = await _DB_unitsCalendar.findOne({
    where: {
      id_author: userId,
      assignedDate: assignedDate
    }
  });
  if(!!userInUnitCalendar) { // there 'is' a non-null result
    throw new forbbidenError("User attempt to upload more than limit a day to api create/daily.", 122);
    return;
  };

  // checking is the img valid
  let coverBase64Buffer, beneathBase64Buffer;
  let coverBase64Splice = modifiedBody.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), beneathBase64Splice;
  if (!!modifiedBody.beneathBase64) beneathBase64Splice = modifiedBody.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  coverBase64Buffer = Buffer.from(coverBase64Splice[2], 'base64');
  const coverImg = await Jimp.read(coverBase64Buffer);
  if (coverImg.bitmap.width <= 0 || coverImg.bitmap.height <= 0) { //do not make a img
    throw new forbbidenError("You didn't submit with an valid img.", 123);
    return;
  }

  if (!!modifiedBody.beneathBase64){
    beneathBase64Buffer = Buffer.from(beneathBase64Splice[2], 'base64');
    const beneathImg = await Jimp.read(beneathBase64Buffer);
    if (beneathImg.bitmap.width <= 0 || beneathImg.bitmap.height <= 0) { //do not make a img
      throw new forbbidenError("You didn't submit with an valid img.", 123);
      return;
    }
  };

  // checking if all the nodes exist.
  let assignedNodes= modifiedBody.nodesSet.map((assignedObj, index)=>{
    return assignedObj.nodeId
  });
  const allNodesConfirm = await _DB_nouns.findAll({
    where: {id: assignedNodes}
  })
  if(
    allNodesConfirm.length != assignedNodes.length || // some node do not exist in DB
    assignedNodes.length == 0 // no node was sent at all
  ){
    throw new forbbidenError(" some of assignedNodes did not exist.", 120);
    return;
  };

}


module.exports = {
  validateShared,
  validateSharedEdit
};
