const router = require("express").Router();
const controller = require("../controllers/authController");

router
  .route('/api/register')
  .post(controller.postRegisterForm);
router
  .route('/api/login')
  .post(controller.postLoginForm);
router.get('/api/2fa/:id', controller.get2FA);
router.post('/api/2fa', controller.post2FAForm);

module.exports = router;