import {
  IsString,
  IsOptional,
  IsUrl,
  IsEnum,
  IsUUID,
  Matches,
} from 'class-validator';
import { BotStatus } from '@prisma/client';

export class UpdateBotDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Target URL must be a valid URL' })
  targetUrl?: string;

  @IsOptional()
  @IsString()
  affiliateTag?: string;

  @IsOptional()
  @IsString()
  telegramToken?: string;

  @IsOptional()
  @IsString()
  chatId?: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)\s+(\*|[0-9,\-\/]+)$/,
    {
      message: 'Schedule must be a valid cron expression',
    },
  )
  scheduleCron?: string;

  @IsOptional()
  @IsEnum(BotStatus, { message: 'Status must be ACTIVE, PAUSED, or ERROR' })
  status?: BotStatus;
}
