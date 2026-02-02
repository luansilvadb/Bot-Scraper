import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../../workers/enums';

export class TaskStatusDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsString()
  productUrl?: string;

  @IsOptional()
  @IsString()
  errorType?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  completedAt?: Date;

  @IsOptional()
  resultId?: string;
}
