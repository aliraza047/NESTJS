import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventService } from './event.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventModel } from './dto/event.model';

@Resolver(() => EventModel)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => EventModel)
  async createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ): Promise<any> {
    const result = await this.eventService.create(createEventInput);
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  @Query(() => [EventModel])
  async events(
    @Args('orgId', { nullable: true }) orgId?: string,
  ): Promise<any> {
    const result = await this.eventService.findAll(orgId);
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  @Query(() => EventModel, { nullable: true })
  async event(@Args('id') id: string): Promise<any> {
    const result = await this.eventService.findOne(id);
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  @Mutation(() => EventModel)
  async updateEvent(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
  ): Promise<any> {
    const { id, ...updateData } = updateEventInput;
    const result = await this.eventService.update(id, updateData);
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  @Mutation(() => EventModel)
  async removeEvent(@Args('id') id: string): Promise<any> {
    const result = await this.eventService.remove(id);
    if (!result.success) throw new Error(result.message);
    return result.data;
  }
}
