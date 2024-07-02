import nodemailer, { Transporter } from "nodemailer";
import { CustomError } from "../../domain";

export interface SendEmailOPtions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailPassword: string,
    private readonly postToProvider: boolean
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword,
      },
    });
  }

  async sendEmail(options: SendEmailOPtions) {
    const { to, subject, htmlBody, attachments = [] } = options;

    if (!this.postToProvider) return true;

    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });
      return true;
    } catch (error) {
      throw new Error(`Something happened ${error}`);
    }
  }
}
