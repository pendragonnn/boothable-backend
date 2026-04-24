import { Module } from '@nestjs/common';
import { EventCategoriesService } from './services/event-categories.service';
import { AdminEventCategoriesController } from './controllers/admin-event-categories.controller';
import { PublicEventCategoriesController } from './controllers/public-event-categories.controller';

@Module({
  controllers: [AdminEventCategoriesController, PublicEventCategoriesController],
  providers: [EventCategoriesService],
})
export class EventCategoriesModule {}
