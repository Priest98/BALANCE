import { IsString, IsOptional, IsBoolean, IsUrl, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCardTypeDto {
  @ApiProperty({ example: 'Amazon Gift Card' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'amazon' })
  @IsString()
  brand: string;

  @ApiPropertyOptional({ example: '/logos/amazon.svg' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
