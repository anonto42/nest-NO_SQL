import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { TemplatesService } from 'common/templates/templates.service';
import * as jwt from 'jsonwebtoken';

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


  createJwtToken(payload: {id: string, role: string}): string
  {
    const secretKey = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRES_IN');

    if ( !secretKey || !expiresIn ) throw new HttpException('JWT_SECRET or JWT_EXPIRES_IN is not defined', HttpStatus.BAD_REQUEST);

    return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
  }

  verifyJwtToken(token: string): any
  {
    const secretKey = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRES_IN');

    if ( !secretKey || !expiresIn ) throw new HttpException('JWT_SECRET or JWT_EXPIRES_IN is not defined', HttpStatus.BAD_REQUEST);

    return jwt.verify(token, secretKey);
  }

}
