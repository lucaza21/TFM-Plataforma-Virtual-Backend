const cloudinary = require('cloudinary').v2;

//const  { CLOUDINARY_CLOUD_API_KEY, CLOUDINARY_CLOUD_API_SECRET, CLOUDINARY_CLOUD_NAME } = require('./config')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
    secure: true
});

const uploadFolder = async (folderName, fName) => {
    return await cloudinary.uploader.upload('uploads\\cd1fd1dec3de7d429ac794bedddd1f2f', 
        {
            folder: folderName,
            public_id : fName  
        }
    )
};

const uploadImage = async (imagePath, folderName, fName) => {
    return await cloudinary.uploader.upload(imagePath, {
        folder: folderName,
        public_id : fName
    })
};

const deleteFolder = async(folderName) => {
    return await cloudinary.api.delete_folder(folderName)
}

const deleteAllImages = async(folderName) => {
    return await cloudinary.api.delete_resources_by_prefix(folderName)
}
const deleteImage = async(publicId) => {
    return await cloudinary.uploader.destroy(publicId)
}


  
module.exports = { uploadFolder, uploadImage, deleteFolder, deleteAllImages, deleteImage }