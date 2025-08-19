import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from 'generated/prisma';
import { ApiResponse, ResponseUtil } from 'src/shared/utility/response';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<ApiResponse<Event>> {
    const { title, description, orgId } = createEventDto;

    try {
      const existing = await this.prisma.event.findFirst({
        where: { title, orgId },
      });
      if (existing) {
        return ResponseUtil.error(
          `Event with title "${title}" already exists for this organization.`,
        );
      }

      const event = await this.prisma.event.create({
        data: {
          title,
          description,
          org: { connect: { id: orgId } },
        },
      });
      return ResponseUtil.success('Event created successfully', event);
    } catch (error) {
      return ResponseUtil.exceptionError(error);
    }
  }

  async findAll(
    orgId?: string,
  ): Promise<
    ApiResponse<(Event & { org: { user: { id: string; email: string } } })[]>
  > {
    try {
      const where = orgId ? { orgId } : {};
      const events = await this.prisma.event.findMany({
        where,
        include: { org: { include: { user: true } } },
      });
      return ResponseUtil.success('Events fetched successfully', events);
    } catch (error) {
      return ResponseUtil.exceptionError(error);
    }
  }

  async findOne(id: string): Promise<ApiResponse<Event | null>> {
    try {
      const event = await this.prisma.event.findUnique({ where: { id } });
      if (!event) {
        return ResponseUtil.notFound(`Event with id ${id} not found`);
      }
      return ResponseUtil.success('Event fetched successfully', event);
    } catch (error) {
      return ResponseUtil.exceptionError(error);
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<ApiResponse<Event>> {
    try {
      const event = await this.prisma.event.findUnique({ where: { id } });
      if (!event) {
        return ResponseUtil.notFound(`Event with id ${id} not found`);
      }

      if (updateEventDto.title && updateEventDto.title !== event.title) {
        const existingTitle = await this.prisma.event.findFirst({
          where: { title: updateEventDto.title, orgId: event.orgId },
        });
        if (existingTitle) {
          return ResponseUtil.error(
            `Event with title "${updateEventDto.title}" already exists for this organization.`,
          );
        }
      }

      const updated = await this.prisma.event.update({
        where: { id },
        data: updateEventDto,
      });
      return ResponseUtil.success('Event updated successfully', updated);
    } catch (error) {
      return ResponseUtil.exceptionError(error);
    }
  }

  async remove(id: string): Promise<ApiResponse<Event>> {
    try {
      const event = await this.prisma.event.findUnique({ where: { id } });
      if (!event) {
        return ResponseUtil.notFound(`Event with id ${id} not found`);
      }
      const deleted = await this.prisma.event.delete({ where: { id } });
      return ResponseUtil.success('Event deleted successfully', deleted);
    } catch (error) {
      return ResponseUtil.exceptionError(error);
    }
  }
}
