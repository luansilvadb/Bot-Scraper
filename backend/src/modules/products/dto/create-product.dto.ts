import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'ASIN is required' })
  asin: string;

  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsNumber({}, { message: 'Current price must be a number' })
  @Min(0, { message: 'Current price must be positive' })
  currentPrice: number;

  @IsNumber({}, { message: 'Original price must be a number' })
  @Min(0, { message: 'Original price must be positive' })
  originalPrice: number;

  @IsInt({ message: 'Discount percentage must be an integer' })
  @Min(0, { message: 'Discount percentage must be at least 0' })
  @Max(100, { message: 'Discount percentage must be at most 100' })
  discountPercentage: number;

  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsNotEmpty({ message: 'Image URL is required' })
  imageUrl: string;

  @IsUrl({}, { message: 'Product URL must be a valid URL' })
  @IsNotEmpty({ message: 'Product URL is required' })
  productUrl: string;

  @IsOptional()
  @IsUUID('4', { message: 'Bot ID must be a valid UUID' })
  botId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Expires at must be a valid date' })
  expiresAt?: string;
}
