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
import { ListsService } from './lists.service';
import { CreateListDto } from '../../common/dto/create-list.dto';
import { UpdateListDto } from '../../common/dto/update-list.dto';
import { List } from '../../common/entities/list.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('lists')
@Controller('lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova lista' })
  @ApiResponse({ status: 201, description: 'Lista criada com sucesso', type: List })
  create(@Body() createListDto: CreateListDto, @Request() req): Promise<List> {
    return this.listsService.create(createListDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todas as listas' })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo de lista' })
  @ApiResponse({ status: 200, description: 'Listas encontradas', type: [List] })
  findAll(@Query('type') type?: string): Promise<List[]> {
    if (type) {
      return this.listsService.findByType(type);
    }
    return this.listsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma lista por ID' })
  @ApiParam({ name: 'id', description: 'ID da lista' })
  @ApiResponse({ status: 200, description: 'Lista encontrada', type: List })
  @ApiResponse({ status: 404, description: 'Lista não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<List> {
    return this.listsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma lista' })
  @ApiParam({ name: 'id', description: 'ID da lista' })
  @ApiResponse({ status: 200, description: 'Lista atualizada com sucesso', type: List })
  @ApiResponse({ status: 404, description: 'Lista não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListDto: UpdateListDto,
  ): Promise<List> {
    return this.listsService.update(id, updateListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma lista' })
  @ApiParam({ name: 'id', description: 'ID da lista' })
  @ApiResponse({ status: 200, description: 'Lista deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Lista não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.listsService.remove(id);
  }
}

