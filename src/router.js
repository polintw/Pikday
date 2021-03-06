const express = require('express');
const router = express.Router();

const auth = require('./auth/main.js');
const accountRouter = require('./account/main.js');
const imgRouter = require('./img/main.js');
const unitsRouter = require('./units/main.js');

const generalRouter = require('./general/main.js');
const nounsRouter = require('./nouns/main.js');
const visitRouter = require('./visit/main.js');
const shareRouter = require('./share/main.js');
const inspireRouter = require('./inspired/main.js');
const uFeedRouter = require('./user/feed/main.js');
const uProfileRouter = require('./user/profile/main.js');

//routes do not protect by token

//veirfy user status
router.use('/', auth)

router.use('/img', imgRouter)
router.use('/general', generalRouter)
router.use('/units', unitsRouter)
router.use('/nouns', nounsRouter)

//approach only after verified
router.use('/account', accountRouter)
router.use('/profile', uProfileRouter)

router.use('/feed', uFeedRouter)
router.use('/visit', visitRouter)
router.use('/share', shareRouter)
router.use('/inspired', inspireRouter)



module.exports = router;
