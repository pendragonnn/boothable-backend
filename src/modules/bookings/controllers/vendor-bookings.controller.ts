import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { createBookingSchema, type CreateBookingDto, queryBookingSchema, type QueryBookingDto } from '../dtos/bookings.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.VENDOR)
export class VendorBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @GetUser('userId') userId: string,
    @Body(new ZodValidationPipe(createBookingSchema)) dto: CreateBookingDto
  ) {
    return this.bookingsService.createVendor(userId, dto);
  }

  @Get()
  async getMyBookings(
    @GetUser('userId') userId: string,
    @Query(new ZodValidationPipe(queryBookingSchema)) query: QueryBookingDto
  ) {
    return this.bookingsService.findVendorBookings(userId, query);
  }

  @Get(':id')
  async getDetail(
    @GetUser('userId') userId: string,
    @Param('id') id: string
  ) {
    return this.bookingsService.findVendorBookingDetail(userId, id);
  }

  @Patch(':id/cancel')
  async cancel(
    @GetUser('userId') userId: string,
    @Param('id') id: string
  ) {
    return this.bookingsService.cancelVendorBooking(userId, id);
  }
}
