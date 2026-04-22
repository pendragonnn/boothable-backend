import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateBoothDto, UpdateBoothDto, QueryBoothDto, BulkCreateBoothDto } from '../dtos/booths.schema';
import { Prisma, BoothStatus } from '@prisma/client';

@Injectable()
export class BoothsService {
  private readonly logger = new Logger(BoothsService.name);

  constructor(private prisma: PrismaService) {}

  // --- Public Operations ---
  async findAllByEvent(eventId: string) {
    this.logger.log(`Fetching booths for event: ${eventId}`);
    const data = await this.prisma.booth.findMany({ where: { eventId } });
    return { data };
  }

  async findOne(id: string) {
    this.logger.log(`Fetching booth detail: ${id}`);
    const booth = await this.prisma.booth.findUnique({ where: { id } });
    if (!booth) throw new NotFoundException('Booth not found');
    return { data: booth };
  }

  // --- Organizer Operations ---
  async createOrganizer(organizerId: string, eventId: string, dto: CreateBoothDto) {
    this.logger.log(`Organizer ${organizerId} creating booth in event ${eventId}`);
    
    // Verify event ownership
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId) throw new ForbiddenException('Not authorized');

    const booth = await this.prisma.booth.create({
      data: {
        eventId,
        boothCode: dto.boothCode,
        type: dto.type,
        size: dto.size,
        pricePerDay: dto.pricePerDay,
        status: dto.status as BoothStatus,
        availableStartDate: new Date(dto.availableStartDate),
        availableEndDate: new Date(dto.availableEndDate),
        description: dto.description,
      },
    });
    return { data: booth };
  }

  async bulkCreateOrganizer(organizerId: string, eventId: string, dto: BulkCreateBoothDto) {
    this.logger.log(`Organizer ${organizerId} bulk creating booths in event ${eventId}`);

    // Verify event ownership
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId) throw new ForbiddenException('Not authorized');

    const dataPayload = dto.booths.map(b => ({
      eventId,
      boothCode: b.boothCode,
      type: b.type,
      size: b.size,
      pricePerDay: b.pricePerDay,
      status: b.status as BoothStatus,
      availableStartDate: new Date(b.availableStartDate),
      availableEndDate: new Date(b.availableEndDate),
      description: b.description,
    }));

    const result = await this.prisma.booth.createMany({
      data: dataPayload,
    });

    return {
      data: {
        count: result.count,
        message: `${result.count} booths created successfully`,
      },
    };
  }

  async updateOrganizer(organizerId: string, id: string, dto: UpdateBoothDto) {
    this.logger.log(`Organizer ${organizerId} updating booth ${id}`);
    
    const booth = await this.prisma.booth.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!booth) throw new NotFoundException('Booth not found');
    if (booth.event?.organizerId !== organizerId) throw new ForbiddenException('Not authorized');

    const updated = await this.prisma.booth.update({
      where: { id },
      data: {
        ...dto,
        pricePerDay: dto.pricePerDay !== undefined ? dto.pricePerDay : undefined,
        status: dto.status as BoothStatus,
        availableStartDate: dto.availableStartDate ? new Date(dto.availableStartDate) : undefined,
        availableEndDate: dto.availableEndDate ? new Date(dto.availableEndDate) : undefined,
      },
    });
    return { data: updated };
  }

  async deleteOrganizer(organizerId: string, id: string) {
    this.logger.log(`Organizer ${organizerId} deleting booth ${id}`);

    const booth = await this.prisma.booth.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!booth) throw new NotFoundException('Booth not found');
    if (booth.event?.organizerId !== organizerId) throw new ForbiddenException('Not authorized');

    await this.prisma.booth.delete({ where: { id } });
    return { data: 'OK' };
  }

  // --- Admin Operations ---
  async findAllAdmin(query: QueryBoothDto) {
    const { page, limit, eventId, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BoothWhereInput = {};
    if (eventId) where.eventId = eventId;
    if (status) where.status = status as BoothStatus;

    const [data, totalData] = await Promise.all([
      this.prisma.booth.findMany({ where, skip, take: limit }),
      this.prisma.booth.count({ where }),
    ]);

    return {
      data,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async updateAdmin(id: string, dto: UpdateBoothDto) {
    this.logger.log(`Admin force updating booth ${id}`);
    const booth = await this.prisma.booth.findUnique({ where: { id } });
    if (!booth) throw new NotFoundException('Booth not found');

    const updated = await this.prisma.booth.update({
      where: { id },
      data: {
        ...dto,
        status: dto.status !== undefined ? (dto.status as BoothStatus) : undefined,
        availableStartDate: dto.availableStartDate ? new Date(dto.availableStartDate) : undefined,
        availableEndDate: dto.availableEndDate ? new Date(dto.availableEndDate) : undefined,
      },
    });
    return { data: updated };
  }

  async deleteAdmin(id: string) {
    this.logger.log(`Admin deleting booth ${id}`);
    const booth = await this.prisma.booth.findUnique({ where: { id } });
    if (!booth) throw new NotFoundException('Booth not found');

    await this.prisma.booth.delete({ where: { id } });
    return { data: 'OK' };
  }
}
