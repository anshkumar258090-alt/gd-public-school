const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = Boolean(
  cloudName &&
  cloudName !== 'demo' &&
  apiKey &&
  apiKey !== '123456789012345' &&
  apiSecret &&
  apiSecret !== 'abcdefghijklmnopqrstuvw'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

// Local storage directories
const baseUploadDir = path.join(__dirname, '../../uploads');
const teamDir = path.join(baseUploadDir, 'team');
const logoDir = path.join(baseUploadDir, 'logo');
const galleryDir = path.join(baseUploadDir, 'gallery');

[baseUploadDir, teamDir, logoDir, galleryDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {}
});

// Also ensure frontend public directories exist for seamless static serving
const feBaseUploadDir = path.join(__dirname, '../../../frontend/public/uploads');
const feTeamDir = path.join(feBaseUploadDir, 'team');
const feLogoDir = path.join(feBaseUploadDir, 'logo');
const feGalleryDir = path.join(feBaseUploadDir, 'gallery');

[feBaseUploadDir, feTeamDir, feLogoDir, feGalleryDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (e) {}
});

function createDiskStorage(subfolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const destDir = path.join(baseUploadDir, subfolder);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
      cb(null, `${subfolder}_${uniqueSuffix}_${cleanBase}${ext}`);
    },
  });
}

let uploadTeamPhoto;
let uploadLogo;
let uploadMedia;

if (isCloudinaryConfigured) {
  try {
    const teamStorage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'gdps/team',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
      },
    });

    const logoStorage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'gdps/logo',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [{ width: 200, height: 200, crop: 'fit' }],
      },
    });

    const mediaStorage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
          folder: 'gdps/gallery',
          resource_type: isVideo ? 'video' : 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'],
        };
      },
    });

    uploadTeamPhoto = multer({ storage: teamStorage, limits: { fileSize: 10 * 1024 * 1024 } });
    uploadLogo = multer({ storage: logoStorage, limits: { fileSize: 10 * 1024 * 1024 } });
    uploadMedia = multer({ storage: mediaStorage, limits: { fileSize: 50 * 1024 * 1024 } });
  } catch (e) {
    console.warn('[Storage] Cloudinary setup failed, falling back to local disk storage:', e);
  }
}

// Fallback to local disk storage if Cloudinary is not configured
if (!uploadTeamPhoto) {
  uploadTeamPhoto = multer({
    storage: createDiskStorage('team'),
    limits: { fileSize: 10 * 1024 * 1024 },
  });
}
if (!uploadLogo) {
  uploadLogo = multer({
    storage: createDiskStorage('logo'),
    limits: { fileSize: 10 * 1024 * 1024 },
  });
}
if (!uploadMedia) {
  uploadMedia = multer({
    storage: createDiskStorage('gallery'),
    limits: { fileSize: 50 * 1024 * 1024 },
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadTeamPhoto,
  uploadLogo,
  uploadMedia,
  baseUploadDir,
  feBaseUploadDir,
};

