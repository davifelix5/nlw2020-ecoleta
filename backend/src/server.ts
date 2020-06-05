import express from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'
import { errors } from 'celebrate'

const app = express();

app.use(cors())
app.use(express.json())  // Faz o express entender o corpo da req em JSON
app.use(routes)

// Forma de fornecer arquivos estáticos diretamente
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(3333, () => console.log('Conectado'));
