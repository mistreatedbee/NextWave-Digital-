import dotenv from 'dotenv'
import { createApp } from './server/app.js'
import { db } from './server/db.js'

dotenv.config({ path: '.env.local' })

const port = Number(process.env.API_PORT || 8787)
createApp(db).listen(port, () => console.log(`NextWave API listening on http://localhost:${port}`))
