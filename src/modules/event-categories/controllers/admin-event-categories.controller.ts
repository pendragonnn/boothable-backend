import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventCategoriesService } from '../services/event-categories.service';
import { createEventCategorySchema, type CreateEventCategoryDto, updateEventCategorySchema, type UpdateEventCategoryDto, queryEventCategorySchema, type QueryEventCategoryDto } from '../dtos/event-categories.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/event-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminEventCategoriesController {
  constructor(private readonly eventCategoriesService: EventCategoriesService) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createEventCategorySchema)) dto: CreateEventCategoryDto) {
    return this.eventCategoriesService.create(dto);
  }

  @Get()
  async findAll(@Query(new ZodValidationPipe(queryEventCategorySchema)) query: QueryEventCategoryDto) {
    return this.eventCategoriesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventCategoriesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ZodValidationPipe(updateEventCategorySchema)) dto: UpdateEventCategoryDto) {
    return this.eventCategoriesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventCategoriesService.remove(id);
  }
}
