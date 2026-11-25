// Vercel entry point: vercel.json rewrites every /api/* request here.
import { createApp } from '../server/app.js'
import { db } from '../server/db.js'

export default createApp(db)
