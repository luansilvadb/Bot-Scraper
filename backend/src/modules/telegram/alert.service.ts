import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramAlertService {
    private readonly logger = new Logger(TelegramAlertService.name);
    private readonly adminChatId: string;

    constructor(
        @InjectBot() private bot: Telegraf<any>,
        private configService: ConfigService,
    ) {
        this.adminChatId = this.configService.get<string>('ADMIN_CHAT_ID') || '';
    }

    async sendAlert(message: string) {
        if (!this.adminChatId) {
            this.logger.warn('ADMIN_CHAT_ID not configured. Skipping alert.');
            return;
        }

        try {
            await this.bot.telegram.sendMessage(this.adminChatId, `⚠️ *BOT ALERT*\n\n${message}`, {
                parse_mode: 'Markdown',
            });
        } catch (error) {
            this.logger.error(`Failed to send Telegram alert: ${error.message}`);
        }
    }

    async sendError(error: Error, context: string) {
        await this.sendAlert(`*Error in ${context}:*\n\`${error.message}\``);
    }
}
