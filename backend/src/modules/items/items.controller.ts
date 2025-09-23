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
  @ApiOperation({ summary: 'Buscar todos os itens do usuário' })
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
    @Request() req?: any,
  ): Promise<Item[]> {
    if (search) {
      return this.itemsService.search(search, req.user.id);
    }
    if (listId) {
      return this.itemsService.findByList(parseInt(listId), req.user.id);
    }
    if (type) {
      return this.itemsService.findByType(type, req.user.id);
    }
    if (status) {
      return this.itemsService.findByStatus(status, req.user.id);
    }
    return this.itemsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um item por ID' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item encontrado', type: Item })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Item> {
    return this.itemsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um item' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso', type: Item })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
    @Request() req,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um item' })
  @ApiParam({ name: 'id', description: 'ID do item' })
  @ApiResponse({ status: 200, description: 'Item deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    return this.itemsService.remove(id, req.user.id);
  }
}

