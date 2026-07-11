import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { CardTypesService } from './card-types.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';
import { AdminGuard } from '../shared/guards/admin.guard';

@ApiTags('card-types')
@Controller('card-types')
export class CardTypesController {
  constructor(private readonly cardTypesService: CardTypesService) {}

  @Get()
  @ApiOperation({ summary: 'List all active card types (public)' })
  findAll() {
    return this.cardTypesService.findAll({ activeOnly: true });
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiSecurity('admin-key')
  @ApiOperation({ summary: 'Create a card type (admin)' })
  create(@Body() dto: CreateCardTypeDto) {
    return this.cardTypesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiSecurity('admin-key')
  @ApiOperation({ summary: 'Update a card type (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateCardTypeDto) {
    return this.cardTypesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiSecurity('admin-key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a card type (admin)' })
  remove(@Param('id') id: string) {
    return this.cardTypesService.remove(id);
  }
}
