import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ScrapedProduct } from '@prisma/client';

@Injectable()
export class TelegramPoster {
  private readonly logger = new Logger(TelegramPoster.name);

  constructor(@InjectBot() private bot: Telegraf<any>) {}

  async postToChannel(
    chatId: string,
    product: ScrapedProduct,
    affiliateTag: string,
  ) {
    this.logger.log(`Posting product ${product.asin} to channel ${chatId}...`);

    const affiliateUrl = `${product.productUrl}?tag=${affiliateTag}`;

    const message = `
🔥 *${product.title}*

💰 *Preço:* R$ ${product.currentPrice.toFixed(2).replace('.', ',')}
📉 *Desconto:* ${product.discountPercentage}% OFF
❌ *De:* R$ ${product.originalPrice.toFixed(2).replace('.', ',')}

📦 *Link:* [Compre agora na Amazon](${affiliateUrl})
    `.trim();

    try {
      if (product.imageUrl) {
        await this.bot.telegram.sendPhoto(chatId, product.imageUrl, {
          caption: message,
          parse_mode: 'Markdown',
        });
      } else {
        await this.bot.telegram.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
        });
      }
      this.logger.log(`Successfully posted product ${product.asin}`);
    } catch (error) {
      this.logger.error(`Failed to post to Telegram: ${error.message}`);
      throw error;
    }
  }
}
