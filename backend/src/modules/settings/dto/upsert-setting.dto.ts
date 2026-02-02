import { IsString, IsNotEmpty } from 'class-validator';

export class UpsertSettingDto {
  @IsString()
  @IsNotEmpty({ message: 'Key is required' })
  key: string;

  @IsString()
  @IsNotEmpty({ message: 'Value is required' })
  value: string;
}
