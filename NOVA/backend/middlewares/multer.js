import multer from "multer"

// Use memory storage — Render's filesystem is ephemeral (#5)
// Files are available as req.file.buffer and never touch disk
const storage = multer.memoryStorage()

const upload = multer({ storage })
export default upload