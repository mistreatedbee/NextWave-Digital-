import fs from 'node:fs'

const LOCAL_CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium']

async function launch() {
  const puppeteer = (await import('puppeteer-core')).default
  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium')).default
    return puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true })
  }
  const executablePath = LOCAL_CHROME.find((p) => p && fs.existsSync(p))
  if (!executablePath) throw new Error('Chrome was not found. Set CHROME_PATH to create PDFs locally.')
  return puppeteer.launch({ executablePath, headless: true })
}

export async function htmlToPdf(html: string): Promise<Buffer> {
  const browser = await launch()
  try {
    const page = await browser.newPage()
    // The document is self-contained, so nothing may be fetched while rendering it.
    await page.setRequestInterception(true)
    page.on('request', (request) => { void (/^(data:|about:)/.test(request.url()) ? request.continue() : request.abort()) })
    await page.emulateMediaType('print')
    await page.setContent(html, { waitUntil: 'load' })
    await page.waitForFunction('window.__paginated > 0', { timeout: 30000 })
    return Buffer.from(await page.pdf({ printBackground: true, preferCSSPageSize: true }))
  } finally {
    await browser.close()
  }
}
