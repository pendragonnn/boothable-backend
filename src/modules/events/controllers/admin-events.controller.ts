import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { createEventSchema, type CreateEventDto, updateEventSchema, type UpdateEventDto } from '../dtos/events.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createEventSchema))
  async create(@Body() dto: CreateEventDto) {
    return this.eventsService.createAdmin(dto);
  }

  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.eventsService.findAllAdmin({ page: Number(page), limit: Number(limit) });
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateEventSchema))
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.updateAdmin(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.eventsService.deleteAdmin(id);
  }
}
