import {
  IsArray,
  IsString,
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateTaskItem {
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

export class BatchCreateTaskDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskItem)
  tasks: CreateTaskItem[];
}
