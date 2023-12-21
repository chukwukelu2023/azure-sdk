const { ClientSecretCredential, DefaultAzureCredential} = require("@azure/identity");
const {BlobServiceClient,StorageSharedKeyCredential} = require("@azure/storage-blob")
const { SubscriptionClient } = require("@azure/arm-subscriptions");
const { v1: uuidv1 } = require("uuid");

require("dotenv").config();
const getResources = async (req,res)=>{

    try {
        let credentials =  new DefaultAzureCredential();
    const client = new SubscriptionClient(credentials);

    const clientList = client.subscriptions.list()
    const subList = []
    
    for await (const item of clientList){
        let subscriptionDetails = await client.subscriptions.get(item.subscriptionId)
        subList.push(subscriptionDetails)
        console.log(subscriptionDetails)
    }

    return res.status(200).send(subList)
    } catch (error) {
        return res.status(500).send(JSON.stringify(error))
    }
    
}

const listBlobContent = async(req,res)=>{
    try {
        const accountName = process.env.STORAGE_ACCOUNT_NAME
        if(!accountName){
            return res.status(404).send("Storage account not found")
        }

        const accountkey= process.env.STORAGE_ACCOUNT_KEY
        if(!accountkey){
            return res.status(404).send("Storsge asccount Key not found")
        }

        const sharedCrdkey = new StorageSharedKeyCredential(accountName,accountkey)
        
        const baseUrl = `https://${accountName}.blob.core.windows.net`
        const containername = process.env.STORAGE_CONTAINER_NAME

        const blobServiceClient = new BlobServiceClient(`${baseUrl}`,sharedCrdkey)

        const containerClient = blobServiceClient.getContainerClient(containername)
        const blobs = []
        for await (const blob of containerClient.listBlobsFlat()){
           
           let storedblob = {
            "name":blob.name,
            "url": `https://${accountName}.blob.core.windows.net/${containername}/${blob.name}`
           }
           blobs.push(storedblob)
        }

        return res.status(200).send(blobs)
    } catch (error) {
        return res.status(500).send(JSON.stringify(error))
    }
}



const uploadFile = async(req,res)=>{
    console.log(req.body.image)
    try {
        const accountName = process.env.STORAGE_ACCOUNT_NAME
        if(!accountName){
            return res.status(404).send("Storage account not found")
        }

        const accountkey= process.env.STORAGE_ACCOUNT_KEY
        if(!accountkey){
            return res.status(404).send("Storage asccount Key not found")
        }

        const sharedCrdkey = new StorageSharedKeyCredential(accountName,accountkey)
        
        const baseUrl = `https://${accountName}.blob.core.windows.net`
        const containername = "fileupload"
        const blobName = `myfile-${uuidv1()}.txt`

        const blobServiceClient = new BlobServiceClient(`${baseUrl}`,sharedCrdkey)
        const containerClient = blobServiceClient.getContainerClient(containername)

        const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      // containerClient.uploadBlockBlob(filename,filename,size)
        console.log(
            `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
          );

    
      const data = 'Hello, World!. This is my new blob storage';
        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        console.log(
        `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );

    return res.status(200).send({
        "message":`\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
    })

    } catch (error) {
        return res.status(500).send(JSON.stringify(error))
    }
}

const uploads = async(req,res)=>{
    const {url,originalname} = req.file
    return res.status(200).send({
        "message":"Files uploaded Succesfully",
        "url":url,
        "filename":originalname
    })
}

const heathCheck = async(req,res)=>{
    return res.status(200).send(process.env)
}

module.exports={
    getResources,
    listBlobContent,
    uploadFile,
    uploads,
    heathCheck
}