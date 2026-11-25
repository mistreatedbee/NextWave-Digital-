// Renders one fictional example of every document type to PDF, without using the database.
// Usage: npm run docs:samples [output-folder]
import fs from 'node:fs'
import path from 'node:path'
import { renderDocument } from '../shared/documents/render.js'
import { fileName } from '../shared/documents/model.js'
import { htmlToPdf } from '../server/documents/pdf.js'
import { demoDocuments, loadBrand } from './demo-data.js'

const out = path.resolve(process.argv[2] ?? 'samples')
fs.mkdirSync(out, { recursive: true })
for (const doc of demoDocuments()) {
  const file = path.join(out, fileName(doc))
  fs.writeFileSync(file, await htmlToPdf(renderDocument(doc, loadBrand())))
  console.log(file)
}
