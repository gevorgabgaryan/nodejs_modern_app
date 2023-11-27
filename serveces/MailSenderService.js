import sgMail from '@sendgrid/mail'
import Config from '../config/'
import logger from '../shared/logger'

sgMail.setApiKey(Config.SendgridAPIKey)

class MailSenderService {
  static async sendMail (recipientEmail, verificationCode, subject) {
    const msg = {
      to: recipientEmail,
      from: Config.fromEmail,
      subject,
      text: `Your verification code is: ${verificationCode}`
    }
    try {
      const [response] = await sgMail.send(msg)
      if (response.statusCode === 202) {
        logger.info(`Mail sent to ${recipientEmail}`)
        return true
      } else {
        return false
      }
    } catch (e) {
      logger.error(e)
      return false
    }
  }
}

export default MailSenderService
