import { getRequiredServerEnvVar } from './misc'

const MAILGUN_SENDING_KEY = getRequiredServerEnvVar('MAILGUN_SENDING_KEY')
const MAILGUN_DOMAIN = getRequiredServerEnvVar('MAILGUN_DOMAIN')

type MailgunMessage = {
  to: string
  from: string
  subject: string
  text: string
  html?: string | null
}

export async function sendEmail({
  to,
  from = 'example@email.com',
  subject,
  text,
  html,
}: MailgunMessage) {
  const auth = `${Buffer.from(`api:${MAILGUN_SENDING_KEY}`).toString('base64')}`

  if (!html) html = text

  const body = new URLSearchParams({
    to,
    from,
    subject,
    text,
    html,
  })

  return fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'post',
    body,
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
}
