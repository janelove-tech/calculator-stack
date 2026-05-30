import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ConvertDto {
  @Type(() => Number)
  @IsNumber()
  value!: number;

  @IsString()
  category!: string;

  @IsString()
  fromUnit!: string;

  @IsString()
  toUnit!: string;
}
