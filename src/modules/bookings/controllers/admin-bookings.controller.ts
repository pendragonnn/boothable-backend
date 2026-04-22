import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { queryBookingSchema, type QueryBookingDto } from '../dtos/bookings.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getAll(@Query(new ZodValidationPipe(queryBookingSchema)) query: QueryBookingDto) {
    return this.bookingsService.findAdminBookings(query);
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.bookingsService.findAdminBookingDetail(id);
  }

  @Patch(':id/force-cancel')
  async forceCancel(@Param('id') id: string) {
    return this.bookingsService.forceCancelAdminBooking(id);
  }
}
