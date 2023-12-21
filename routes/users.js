var express = require('express');
const {getResources, listBlobContent, uploadFile, uploads, heathCheck} = require("../controllers/resources")
const {upload} = require("../middleware/upload")
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/resource",getResources)
router.get("/blobs",listBlobContent)
router.get("/health",heathCheck)
router.post("/upload",upload.single("image"),uploadFile)
router.post("/uploads",upload.single("files") ,uploads)

module.exports = router;
