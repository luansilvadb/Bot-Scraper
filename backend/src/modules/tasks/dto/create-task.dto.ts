import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  productUrl: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priority?: number;
}
