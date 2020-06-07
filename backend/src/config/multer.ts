import multer from 'multer'
import { randomBytes } from 'crypto'
import path from 'path'


export default multer({
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(request, file, callback) {
            const hash = randomBytes(6).toString('hex');
            const fileName = `${hash}-${file.originalname}`

            callback(null, fileName)
        }
    }),
    fileFilter(request, file, callback) {
        const fileExtension = path.extname(file.originalname)
        const permitedExts = ['.png', '.jpg', '.jpeg']
        const checkedExts = permitedExts.filter(ext => ext == fileExtension)

        if (checkedExts.length == 0) {
            return callback(new Error('Apenas images são permitidas'))
        }

        return callback(null, true)
    }
})
