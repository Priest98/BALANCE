import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardTypeDto } from './dto/create-card-type.dto';
import { UpdateCardTypeDto } from './dto/update-card-type.dto';

@Injectable()
export class CardTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: { activeOnly?: boolean } = {}) {
    return this.prisma.cardType.findMany({
      where: options.activeOnly ? { active: true } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const cardType = await this.prisma.cardType.findUnique({ where: { id } });
    if (!cardType) throw new NotFoundException(`Card type ${id} not found`);
    return cardType;
  }

  async findByBrand(brand: string) {
    const cardType = await this.prisma.cardType.findUnique({ where: { brand } });
    if (!cardType) throw new NotFoundException(`Card type with brand "${brand}" not found`);
    return cardType;
  }

  async create(dto: CreateCardTypeDto) {
    return this.prisma.cardType.create({ data: dto });
  }

  async update(id: string, dto: UpdateCardTypeDto) {
    await this.findOne(id);
    return this.prisma.cardType.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cardType.delete({ where: { id } });
  }
}
