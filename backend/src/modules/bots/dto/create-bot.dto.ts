import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsEnum,
  IsUUID,
  Matches,
} from 'class-validator';
import { BotStatus } from '@prisma/client';

export class CreateBotDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsUrl({}, { message: 'Target URL must be a valid URL' })
  @IsNotEmpty({ message: 'Target URL is required' })
  targetUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Affiliate tag is required' })
  affiliateTag: string;

  @IsString()
  @IsNotEmpty({ message: 'Telegram token is required' })
  telegramToken: string;

  @IsString()
  @IsNotEmpty({ message: 'Chat ID is required' })
  chatId: string;

  @IsString()
  @IsNotEmpty({ message: 'Schedule cron is required' })
  @Matches(
    /^(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)$/,
    {
      message: 'Schedule must be a valid cron expression',
    },
  )
  scheduleCron: string;

  @IsOptional()
  @IsEnum(BotStatus, { message: 'Status must be ACTIVE, PAUSED, or ERROR' })
  status?: BotStatus = BotStatus.ACTIVE;
}
