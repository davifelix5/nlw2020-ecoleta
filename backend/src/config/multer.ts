import multer from 'multer'
import { randomBytes } from 'crypto'
import path from 'path'

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = randomBytes(6).toString('hex');
            const fileName = `${hash}-${file.originalname}`

            callback(null, fileName)
        }
    })
}