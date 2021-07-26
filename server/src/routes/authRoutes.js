const router = require("express").Router();
const multer = require('multer')();
const bodyParser = require('body-parser');
const controller = require("../controllers/authController");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router
  .route('/api/register')
  .post(urlencodedParser, multer.none(), controller.postRegisterForm);
router
  .route('/api/login')
  .post(controller.postLoginForm);
router.get('/api/2fa/:id', controller.get2FA);
router.post('/api/2fa', controller.post2FAForm);

module.exports = router;