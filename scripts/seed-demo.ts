// Adds one fictional document of each type for testing, or removes them again.
//   npm run docs:seed -- --yes       add the examples
//   npm run docs:seed -- --remove    delete them
import { totals } from '../shared/documents/model.js'
import { connect } from './db.js'
import { demoDocuments } from './demo-data.js'

const remove = process.argv.includes('--remove')
if (!remove && !process.argv.includes('--yes')) {
  console.log('This writes demonstration documents (references ending -901) to the database in .env.local.\nRun again with --yes to continue, or --remove to delete them.')
  process.exit(0)
}
const client = await connect()
if (remove) {
  await client.query("delete from public.document_events where document_id like 'DEMO-%'")
  const result = await client.query("delete from public.business_documents where id like 'DEMO-%'")
  console.log(`Removed ${result.rowCount} demonstration documents`)
} else {
  for (const doc of demoDocuments()) {
    const result = await client.query('insert into public.business_documents (id, type, reference, status, data, total_cents) values ($1, $2, $3, $4, $5, $6) on conflict do nothing',
      [doc.id, doc.type, doc.reference, doc.status, JSON.stringify(doc.data), totals(doc.data).total])
    if (result.rowCount) await client.query("insert into public.document_events (document_id, action, detail) values ($1, 'Created', 'Demonstration document')", [doc.id])
    console.log(`${result.rowCount ? 'Added' : 'Already present'} ${doc.reference}`)
  }
}
await client.end()
