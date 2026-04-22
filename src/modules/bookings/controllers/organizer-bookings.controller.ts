import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { queryBookingSchema, QueryBookingDto, updateBookingStatusSchema, UpdateBookingStatusDto } from '../dtos/bookings.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@Controller('organizer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ORGANIZER)
export class OrganizerBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  async getManagedBookings(
    @GetUser('userId') organizerId: string,
    @Query(new ZodValidationPipe(queryBookingSchema)) query: QueryBookingDto
  ) {
    return this.bookingsService.findOrganizerBookings(organizerId, query);
  }

  @Get('bookings/:id')
  async getManagedBookingDetail(
    @GetUser('userId') organizerId: string,
    @Param('id') id: string
  ) {
    return this.bookingsService.findOrganizerBookingDetail(organizerId, id);
  }

  @Patch('bookings/:id/status')
  async updateBookingStatus(
    @GetUser('userId') organizerId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBookingStatusSchema)) dto: UpdateBookingStatusDto
  ) {
    return this.bookingsService.updateOrganizerBookingStatus(organizerId, id, dto);
  }

  @Get('events/:eventId/attendees')
  async getEventAttendees(
    @GetUser('userId') organizerId: string,
    @Param('eventId') eventId: string
  ) {
    return this.bookingsService.getOrganizerEventAttendees(organizerId, eventId);
  }
}
