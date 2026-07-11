import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  MinLength,
  MaxLength,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVerificationDto {
  @ApiProperty({ example: 'amazon', description: 'Card type brand identifier' })
  @IsString()
  cardTypeId: string;

  @ApiProperty({ example: 'USD', description: 'ISO 4217 currency code' })
  @IsString()
  @Length(3, 3)
  @Transform(({ value }) => (value as string).toUpperCase())
  currency: string;

  @ApiProperty({ example: 50.0, description: 'Card face value amount' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Max(10000)
  amount: number;

  @ApiProperty({ example: 'XXXX-XXXX-XXXX-XXXX', description: 'Gift card code' })
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  @Transform(({ value }) => (value as string).trim())
  cardCode: string;

  @ApiPropertyOptional({ example: '1234', description: 'Optional PIN (4-8 digits)' })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  pin?: string;
}
