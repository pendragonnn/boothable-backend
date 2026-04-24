import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto, QueryEventDto } from '../dtos/events.schema';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private prisma: PrismaService) {}

  // --- Public Operations ---
  async findAllPublic(query: QueryEventDto) {
    this.logger.log('Fetching public events');
    const { search, location, startDate, endDate, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};
    if (search) where.eventName = { contains: search, mode: 'insensitive' };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const [data, totalData] = await Promise.all([
      this.prisma.event.findMany({ where, skip, take: limit, include: { category: true } }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data,
      paging: {
        page,
        totalPage: Math.ceil(totalData / limit),
        totalData,
      },
    };
  }

  async findOne(id: string) {
    this.logger.log(`Fetching event detail: ${id}`);
    const event = await this.prisma.event.findUnique({ where: { id }, include: { category: true } });
    if (!event) throw new NotFoundException('Event not found');
    return { data: event };
  }

  // --- Organizer Operations ---
  async createOrganizer(organizerId: string, dto: CreateEventDto) {
    this.logger.log(`Creating event for organizer ${organizerId}`);
    const event = await this.prisma.event.create({
      data: {
        eventName: dto.eventName,
        categoryId: dto.categoryId,
        location: dto.location,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        description: dto.description,
        paymentVa: dto.paymentVa,
        organizerId,
      },
    });
    return { data: event };
  }

  async findAllOrganizer(organizerId: string, query: { page: number; limit: number }) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const where = { organizerId };

    const [data, totalData] = await Promise.all([
      this.prisma.event.findMany({ where, skip, take: limit, include: { category: true } }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async updateOrganizer(organizerId: string, id: string, dto: UpdateEventDto) {
    this.logger.log(`Updating event ${id} by organizer ${organizerId}`);
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId) throw new ForbiddenException('Not authorized');

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
    return { data: updated };
  }

  async deleteOrganizer(organizerId: string, id: string) {
    this.logger.log(`Deleting event ${id} by organizer ${organizerId}`);
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId) throw new ForbiddenException('Not authorized');

    await this.prisma.event.delete({ where: { id } });
    return { data: 'OK' };
  }

  async uploadMap(organizerId: string, id: string, fileUrl: string) {
    this.logger.log(`Uploading map for event ${id}`);
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId) throw new ForbiddenException('Not authorized');

    const updated = await this.prisma.event.update({
      where: { id },
      data: { eventBoothMap: fileUrl },
    });
    return { data: { eventBoothMap: updated.eventBoothMap } };
  }

  // --- Admin Operations ---
  async createAdmin(dto: CreateEventDto) {
    this.logger.log(`Admin creating event`);
    const event = await this.prisma.event.create({
      data: {
        eventName: dto.eventName,
        categoryId: dto.categoryId,
        location: dto.location,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        description: dto.description,
        paymentVa: dto.paymentVa,
        organizerId: dto.organizerId, // Can be set explicitly
      },
    });
    return { data: event };
  }

  async findAllAdmin(query: { page: number; limit: number }) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, totalData] = await Promise.all([
      this.prisma.event.findMany({ skip, take: limit, include: { category: true } }),
      this.prisma.event.count(),
    ]);

    return {
      data,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async updateAdmin(id: string, dto: UpdateEventDto) {
    this.logger.log(`Admin force updating event ${id}`);
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
    return { data: updated };
  }

  async deleteAdmin(id: string) {
    this.logger.log(`Admin deleting event ${id}`);
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    await this.prisma.event.delete({ where: { id } });
    return { data: 'OK' };
  }
}
