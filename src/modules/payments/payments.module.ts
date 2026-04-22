import { Module } from '@nestjs/common';
import { PaymentsService } from './services/payments.service';
import { VendorPaymentsController } from './controllers/vendor-payments.controller';
import { OrganizerPaymentsController } from './controllers/organizer-payments.controller';
import { AdminPaymentsController } from './controllers/admin-payments.controller';

@Module({
  controllers: [
    VendorPaymentsController,
    OrganizerPaymentsController,
    AdminPaymentsController,
  ],
  providers: [PaymentsService],
})
export class PaymentsModule {}
