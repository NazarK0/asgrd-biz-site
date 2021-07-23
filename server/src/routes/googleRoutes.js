const router = require("express").Router();
const controller = require("../controllers/googleController");

router.get('/oauth2callback', controller.getOauthCallback);

module.exports = router;