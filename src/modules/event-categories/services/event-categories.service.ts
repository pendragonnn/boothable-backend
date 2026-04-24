import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { type CreateEventCategoryDto, type UpdateEventCategoryDto, type QueryEventCategoryDto } from '../dtos/event-categories.schema';

@Injectable()
export class EventCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventCategoryDto) {
    const existing = await this.prisma.eventCategory.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] }
    });
    if (existing) throw new ConflictException('Category name or slug already exists');

    const category = await this.prisma.eventCategory.create({ data: dto });
    return { data: category };
  }

  async findAll(query: QueryEventCategoryDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, totalData] = await Promise.all([
      this.prisma.eventCategory.findMany({ skip, take: limit }),
      this.prisma.eventCategory.count(),
    ]);

    return {
      data,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.eventCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Event category not found');
    return { data: category };
  }

  async update(id: string, dto: UpdateEventCategoryDto) {
    await this.findOne(id); // Check exists
    if (dto.name || dto.slug) {
      const orConditions: any[] = [];
      if (dto.name) orConditions.push({ name: dto.name });
      if (dto.slug) orConditions.push({ slug: dto.slug });
      
      const existing = await this.prisma.eventCategory.findFirst({
        where: { 
          OR: orConditions,
          id: { not: id }
        }
      });
      if (existing) throw new ConflictException('Category name or slug already exists');
    }
    const updated = await this.prisma.eventCategory.update({ where: { id }, data: dto });
    return { data: updated };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.eventCategory.delete({ where: { id } });
    return { data: 'OK' };
  }
}
