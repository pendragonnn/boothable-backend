import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { PublicEventsController } from './controllers/public-events.controller';
import { OrganizerEventsController } from './controllers/organizer-events.controller';
import { AdminEventsController } from './controllers/admin-events.controller';

@Module({
  controllers: [
    PublicEventsController,
    OrganizerEventsController,
    AdminEventsController,
  ],
  providers: [EventsService],
})
export class EventsModule {}
