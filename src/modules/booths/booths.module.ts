import { Module } from '@nestjs/common';
import { BoothsService } from './services/booths.service';
import { PublicBoothsController } from './controllers/public-booths.controller';
import { OrganizerBoothsController } from './controllers/organizer-booths.controller';
import { AdminBoothsController } from './controllers/admin-booths.controller';

@Module({
  controllers: [
    PublicBoothsController,
    OrganizerBoothsController,
    AdminBoothsController,
  ],
  providers: [BoothsService],
})
export class BoothsModule {}
