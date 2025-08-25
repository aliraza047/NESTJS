import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventResolver } from './event.resolver';

@Module({
  controllers: [EventController],
  providers: [EventService, EventResolver],
})
export class EventModule {}
