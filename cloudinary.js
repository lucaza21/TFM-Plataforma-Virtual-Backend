const cloudinary = require('cloudinary').v2;

const  { CLOUDINARY_CLOUD_API_KEY, CLOUDINARY_CLOUD_API_SECRET, CLOUDINARY_CLOUD_NAME } = require('./config')

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_CLOUD_API_KEY,
    api_secret: CLOUDINARY_CLOUD_API_SECRET,
    secure: true
});

const uploadImage = async (imagePath) => {
    return await cloudinary.uploader.upload(imagePath, {
        folder: 'replit'
    })
};

const createFolder = async (localImage, folderName) => {
    return await cloudinary.uploader.upload(localImage, {
        folder: folderName
    })
};


const deleteImage = async(publicId) => {
    await cloudinary.uploader.destroy(publicId)
}

module.exports = { uploadImage, deleteImage, createFolder }