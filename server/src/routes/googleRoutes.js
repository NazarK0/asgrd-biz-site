const router = require("express").Router();
const controller = require("../controllers/googleController");

router.get('/api/google-sheets/main', controller.getGoogleSheetsMain);
router.post('/api/google-sheets/add-user', controller.postGoogleSheetsAddUser);


module.exports = router;