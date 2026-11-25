import { esc } from '../../shared/documents/render.js'
import type { Brand } from '../../shared/documents/model.js'

export const emailConfigured = () => !!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)

export function emailHtml(brand: Brand, options: { greeting: string; message: string; button?: { label: string; url: string } }) {
  const button = options.button ? `<p style="margin:28px 0"><a href="${esc(options.button.url)}" style="background:#B5D300;color:#0A0A0A;font-weight:bold;text-decoration:none;padding:13px 24px;display:inline-block">${esc(options.button.label)}</a></p>` : ''
  return `<!doctype html><html><body style="margin:0;background:#F4F4F4;font-family:Lato,Arial,sans-serif;color:#161616">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff">
<tr><td style="background:#0A0A0A;border-bottom:5px solid #B5D300;padding:22px 28px;color:#fff;font-size:19px;font-weight:bold">NextWave <span style="color:#B5D300">Digital Solutions</span></td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6"><p>${esc(options.greeting)}</p><p>${esc(options.message).replace(/\n/g, '<br>')}</p>${button}
<p style="margin-top:28px">Kind regards,<br><b>${esc(brand.signatoryName)}</b> | ${esc(brand.company)} | ${esc(brand.phone)}</p></td></tr>
<tr><td style="background:#0A0A0A;color:#9a9a9a;padding:16px 28px;font-size:12px">${esc(brand.email)} | ${esc(brand.website)}</td></tr>
</table></td></tr></table></body></html>`
}

export async function sendEmail(message: { to: string; subject: string; html: string; attachment?: { filename: string; content: Buffer } }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM, to: [message.to], reply_to: process.env.EMAIL_REPLY_TO || undefined, subject: message.subject, html: message.html,
      attachments: message.attachment ? [{ filename: message.attachment.filename, content: message.attachment.content.toString('base64') }] : undefined,
    }),
  })
  if (!response.ok) throw new Error(`Email provider refused the message (${response.status})`)
}
