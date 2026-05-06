import { v2 as cloudinary } from 'cloudinary'

// Configure ONCE at module load — not inside the upload function (#12)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload a file to Cloudinary.
 * Accepts either a Buffer (multer memoryStorage) or a file path string.
 * Throws on failure so the calling controller can handle it (#2).
 */
const uploadOnCloudinary = (input) => {
    return new Promise((resolve, reject) => {
        if (Buffer.isBuffer(input)) {
            // Memory-storage path: pipe buffer via upload_stream (#5)
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`))
                    resolve(result.secure_url)
                }
            )
            stream.end(input)
        } else {
            // Legacy disk-path fallback
            cloudinary.uploader.upload(input)
                .then(result => resolve(result.secure_url))
                .catch(err => reject(new Error(`Cloudinary upload failed: ${err.message}`)))
        }
    })
}

export default uploadOnCloudinary