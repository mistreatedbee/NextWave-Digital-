// Saves the private banking details in brand.local to the database settings.
import fs from 'node:fs'
import { connect } from './db.js'
import { loadBrand } from './demo-data.js'

if (!fs.existsSync(new URL('../brand.local', import.meta.url))) throw new Error('brand.local was not found')
const client = await connect()
await client.query("insert into public.document_settings (key, value) values ('brand', $1) on conflict (key) do update set value = excluded.value, updated_at = now()", [JSON.stringify(loadBrand())])
await client.end()
console.log('Company and banking details saved')
