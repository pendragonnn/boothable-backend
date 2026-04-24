import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { EventCategoriesService } from '../services/event-categories.service';
import { queryEventCategorySchema, type QueryEventCategoryDto } from '../dtos/event-categories.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('event-categories')
export class PublicEventCategoriesController {
  constructor(private readonly eventCategoriesService: EventCategoriesService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(queryEventCategorySchema))
  async findAll(@Query() query: QueryEventCategoryDto) {
    return this.eventCategoriesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventCategoriesService.findOne(id);
  }
}
