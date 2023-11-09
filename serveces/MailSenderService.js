import sgMail from "@sendgrid/mail";
import Config from "../config/";

sgMail.setApiKey(Config.SendgridAPIKey);

class MailSenderService {
  static async sendMail(recipientEmail, verificationCode, subject) {
    const msg = {
      to: recipientEmail,
      from: Config.fromEmail,
      subject,
      text: `Your verification code is: ${verificationCode}`,
    };
    try {
      const [response] = await sgMail.send(msg);
      if (response.statusCode === 202) {
        console.log(`Mail sent to ${recipientEmail}`);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default MailSenderService
