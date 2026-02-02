import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto';

export class ProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be a valid product status' })
  status?: ProductStatus;

  @IsOptional()
  @IsUUID('4', { message: 'Bot ID must be a valid UUID' })
  botId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Min discount must be an integer' })
  @Min(0, { message: 'Min discount must be at least 0' })
  @Max(100, { message: 'Min discount must be at most 100' })
  minDiscount?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
