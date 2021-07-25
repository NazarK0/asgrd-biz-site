const router = require("express").Router();
const controller = require("../controllers/googleController");

router.post('/api/mail/send', controller.postSendMail);

module.exports = router;