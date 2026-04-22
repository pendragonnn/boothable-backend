import { Controller, Get, Param } from '@nestjs/common';
import { BoothsService } from '../services/booths.service';

@Controller()
export class PublicBoothsController {
  constructor(private readonly boothsService: BoothsService) {}

  @Get('events/:eventId/booths')
  async getByEvent(@Param('eventId') eventId: string) {
    return this.boothsService.findAllByEvent(eventId);
  }

  @Get('booths/:id')
  async getDetail(@Param('id') id: string) {
    return this.boothsService.findOne(id);
  }
}
