import { Module } from '@nestjs/common';
import { BookingsService } from './services/bookings.service';
import { VendorBookingsController } from './controllers/vendor-bookings.controller';
import { OrganizerBookingsController } from './controllers/organizer-bookings.controller';
import { AdminBookingsController } from './controllers/admin-bookings.controller';

@Module({
  controllers: [
    VendorBookingsController,
    OrganizerBookingsController,
    AdminBookingsController,
  ],
  providers: [BookingsService],
})
export class BookingsModule {}
