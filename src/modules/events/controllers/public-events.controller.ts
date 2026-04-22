import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { queryEventSchema, type QueryEventDto } from '../dtos/events.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('events')
export class PublicEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(queryEventSchema))
  async getAll(@Query() query: QueryEventDto) {
    return this.eventsService.findAllPublic(query);
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}
