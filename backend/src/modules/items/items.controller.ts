import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from '../../common/dto/create-item.dto';
import { UpdateItemDto } from '../../common/dto/update-item.dto';
import { Item } from '../../common/entities/item.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo item' })
  @ApiResponse({ status: 201, description: 'Item criado com sucesso', type: Item })
  create(@Body() createItemDto: CreateItemDto, @Request() req): Promise<Item> {
    return this.itemsService.create(createItemDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os itens' })
  @ApiQuery({ name: 'listId', required: false, description: 'Filtrar por ID da lista' })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo (game, movie, series)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por título, descrição ou gênero' })
  @ApiResponse({ status: 200, description: 'Itens encontrados', type: [Item] })
  findAll(
    @Query('listId') listId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<Item[]> {
    if (search) {
      return this.itemsService.search(search);
    }
    if (listId) {
      return this.itemsService.findByList(parseInt(listId));
    }
    if (type) {
      return this.itemsService.findByType(type);
    }
    if (status) {
      return this.itemsService.findByStatus(status);
    }
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um item por ID' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item encontrado', type: Item })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um item' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso', type: Item })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um item' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.itemsService.remove(id);
  }
}

