const router = require("express").Router();
const controller = require("../controllers/googleController");

router.post('/api/mail/send', controller.postSendMail);
router.post('/api/oauth2', controller.postOAuth2);


module.exports = router;