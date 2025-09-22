import { IsString, IsEnum, IsOptional, IsNumber, IsUrl, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemType, ItemStatus } from '../entities/item.entity';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({ description: 'Título do item', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Tipo do item', enum: ItemType })
  @IsEnum(ItemType)
  type: ItemType;

  @ApiProperty({ description: 'Status do item', enum: ItemStatus })
  @IsEnum(ItemStatus)
  status: ItemStatus;

  @ApiPropertyOptional({ description: 'Descrição do item', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Gênero do item' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Ano de lançamento' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1900)
  @Max(2030)
  releaseYear?: number;

  @ApiPropertyOptional({ description: 'Avaliação (0-10)', minimum: 0, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({ description: 'Notas pessoais', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'URL da imagem' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Plataforma (console, streaming, etc.)' })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({ description: 'ID da lista à qual o item pertence' })
  @IsNumber()
  @Type(() => Number)
  listId: number;
}

