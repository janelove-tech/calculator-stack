import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class EvaluateDto {
  @IsString()
  operation!: string;

  @Type(() => Number)
  @IsNumber()
  value!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  secondValue?: number;

  @IsOptional()
  @IsIn(['deg', 'rad'])
  angleMode?: 'deg' | 'rad';
}
