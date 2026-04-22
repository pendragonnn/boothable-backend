import { Controller, Post, Patch, Delete, Body, Param, UseGuards, UsePipes } from '@nestjs/common';
import { BoothsService } from '../services/booths.service';
import { createBoothSchema, type CreateBoothDto, bulkCreateBoothSchema, type BulkCreateBoothDto, updateBoothSchema, type UpdateBoothDto } from '../dtos/booths.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@Controller('organizer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ORGANIZER)
export class OrganizerBoothsController {
  constructor(private readonly boothsService: BoothsService) {}

  @Post('events/:eventId/booths')
  @UsePipes(new ZodValidationPipe(createBoothSchema))
  async create(
    @GetUser('userId') organizerId: string,
    @Param('eventId') eventId: string,
    @Body() dto: CreateBoothDto
  ) {
    return this.boothsService.createOrganizer(organizerId, eventId, dto);
  }

  @Post('events/:eventId/booths/bulk')
  @UsePipes(new ZodValidationPipe(bulkCreateBoothSchema))
  async createBulk(
    @GetUser('userId') organizerId: string,
    @Param('eventId') eventId: string,
    @Body() dto: BulkCreateBoothDto
  ) {
    return this.boothsService.bulkCreateOrganizer(organizerId, eventId, dto);
  }

  @Patch('booths/:id')
  @UsePipes(new ZodValidationPipe(updateBoothSchema))
  async update(
    @GetUser('userId') organizerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBoothDto
  ) {
    return this.boothsService.updateOrganizer(organizerId, id, dto);
  }

  @Delete('booths/:id')
  async delete(
    @GetUser('userId') organizerId: string,
    @Param('id') id: string
  ) {
    return this.boothsService.deleteOrganizer(organizerId, id);
  }
}
