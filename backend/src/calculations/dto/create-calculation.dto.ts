import { CalculatorMode } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCalculationDto {
  @IsEnum(CalculatorMode)
  mode!: CalculatorMode;

  @IsString()
  @MaxLength(500)
  expression!: string;

  @IsString()
  @MaxLength(100)
  result!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
