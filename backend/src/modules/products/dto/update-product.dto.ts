import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Current price must be a number' })
  @Min(0, { message: 'Current price must be positive' })
  currentPrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Original price must be a number' })
  @Min(0, { message: 'Original price must be positive' })
  originalPrice?: number;

  @IsOptional()
  @IsInt({ message: 'Discount percentage must be an integer' })
  @Min(0, { message: 'Discount percentage must be at least 0' })
  @Max(100, { message: 'Discount percentage must be at most 100' })
  discountPercentage?: number;

  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Product URL must be a valid URL' })
  productUrl?: string;

  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be a valid product status' })
  status?: ProductStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Expires at must be a valid date' })
  expiresAt?: string | null;
}
