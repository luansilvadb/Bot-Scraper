import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto';

export class SettingQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
