import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SaveConversionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsString()
  category!: string;

  @IsString()
  fromUnit!: string;

  @IsString()
  toUnit!: string;
}
