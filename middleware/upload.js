const multer = require("multer")
const multerAzure = require("multer-azure")
const { v1: uuidv1 } = require("uuid");
const path = require("path")

require("dotenv").config();

const {STORAGE_ACCOUNT_CONNECTION_STRING,STORAGE_ACCOUNT_NAME,STORAGE_ACCOUNT_KEY,STORAGE_CONTAINER_NAME} = process.env
//console.log({STORAGE_ACCOUNT_CONNECTION_STRING,STORAGE_ACCOUNT_NAME,STORAGE_ACCOUNT_KEY,STORAGE_CONTAINER_NAME})

const upload = multer({ 
    storage: multerAzure({
      connectionString: STORAGE_ACCOUNT_CONNECTION_STRING, //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
      account: STORAGE_ACCOUNT_NAME, //The name of the Azure storage account
      key: STORAGE_ACCOUNT_KEY, //A key listed under Access keys in the storage account pane
      container: STORAGE_CONTAINER_NAME,  //Any container name, it will be created if it doesn't exist
      blobPathResolver: function(req, file, callback){
        callback(null, `${uuidv1()}${path.extname(file.originalname)}`);
      }
    })
  })

  module.exports={
    upload
  }