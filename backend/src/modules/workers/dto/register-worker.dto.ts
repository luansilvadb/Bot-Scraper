import { IsString, IsNotEmpty, Length } from 'class-validator';

export class RegisterWorkerDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;
}
