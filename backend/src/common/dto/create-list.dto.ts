import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ListType } from '../entities/list.entity';

export class CreateListDto {
  @ApiProperty({ description: 'Nome da lista', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Tipo da lista', enum: ListType })
  @IsEnum(ListType)
  type: ListType;

  @ApiPropertyOptional({ description: 'Descrição da lista', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

