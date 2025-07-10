import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { TemplatesService } from 'common/templates/templates.service';

@Injectable()
export class UtilsService 
{
    private readonly transporter: nodemailer.Transporter;
    
    constructor(
        private readonly configService: ConfigService,
        private readonly templatesService: TemplatesService
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
            secure: false, 
            auth: {
              user: this.configService.get('MAIL_USER'),
              pass: this.configService.get('MAIL_PASS'),
            },
        })
    }

    async sendMail(to: string, otp: string, subject: string = 'Your One-Time Password (OTP)', message: string = 'Here is your OTP for verification:'): Promise<void> 
    {
        const htmlTemplate = this.templatesService.generateOtpTemplate(otp, subject, message);

        const mailOptions = {
          from: this.configService.get('MAIL_FROM'), 
          to, 
          subject, 
          html: htmlTemplate,
        };
    
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log('Message sent: %s', info.messageId);
          return info;
        } catch (error) {
          console.error('Error sending email:', error);
          throw new Error('Failed to send email');
        }
    }
}
