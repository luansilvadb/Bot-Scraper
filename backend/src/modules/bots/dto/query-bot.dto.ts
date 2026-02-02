import { IsOptional, IsEnum, IsString } from 'class-validator';
import { BotStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto';

export class BotQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(BotStatus, { message: 'Status must be ACTIVE, PAUSED, or ERROR' })
  status?: BotStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
