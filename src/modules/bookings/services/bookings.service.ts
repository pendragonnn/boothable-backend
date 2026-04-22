import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import {
  CreateBookingDto,
  QueryBookingDto,
  UpdateBookingStatusDto,
} from '../dtos/bookings.schema';
import { Prisma, BookingStatus, BoothStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private prisma: PrismaService) {}

  // --- Vendor Operations ---
  async createVendor(userId: string, dto: CreateBookingDto) {
    this.logger.log(
      `Vendor ${userId} creating booking for booth ${dto.boothId}`,
    );

    const booth = await this.prisma.booth.findUnique({
      where: { id: dto.boothId },
    });
    if (!booth) throw new NotFoundException('Booth not found');
    if (booth.status === BoothStatus.UNAVAILABLE) {
      throw new BadRequestException('Booth is currently unavailable');
    }

    const startDate = new Date(dto.rentalStartDate);
    const endDate = new Date(dto.rentalEndDate);

    if (
      startDate < booth.availableStartDate ||
      endDate > booth.availableEndDate
    ) {
      throw new BadRequestException(
        'Rental dates are outside the booth availability range',
      );
    }
    if (startDate > endDate) {
      throw new BadRequestException(
        'Rental start date must be before or equal to end date',
      );
    }

    // Overlapping Check
    const overlappingBookings = await this.prisma.booking.findFirst({
      where: {
        boothId: dto.boothId,
        status: { notIn: [BookingStatus.REJECTED, BookingStatus.CANCELLED] },
        AND: [
          { rentalStartDate: { lte: endDate } },
          { rentalEndDate: { gte: startDate } },
        ],
      },
    });

    if (overlappingBookings) {
      throw new BadRequestException(
        'Booth is already booked for the selected dates',
      );
    }

    // Calculate secure Total Price: (difference in days inclusive) * pricePerDay
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) + 1; // inclusive
    const totalPrice =
      BigInt(Math.max(1, diffDays)) * BigInt(booth.pricePerDay.toString());

    // Prisma total_price is BigInt
    const serializeBigInt = (obj: any) => ({
      ...obj,
      totalPrice: obj.totalPrice.toString(),
    });

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        boothId: dto.boothId,
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        status: BookingStatus.PENDING,
        totalPrice,
        payments: {
          create: {
            paymentStatus: 'UNPAID',
            paymentMethod: 'BANK_TRANSFER'
          }
        }
      },
    });

    return { data: serializeBigInt(booking) };
  }

  async findVendorBookings(userId: string, query: QueryBookingDto) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = { userId };
    if (status) where.status = status as BookingStatus;

    const [data, totalData] = await Promise.all([
      this.prisma.booking.findMany({ where, skip, take: limit }),
      this.prisma.booking.count({ where }),
    ]);

    const serializedData = data.map((d) => ({
      ...d,
      totalPrice: d.totalPrice.toString(),
    }));

    return {
      data: serializedData,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async findVendorBookingDetail(userId: string, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId)
      throw new ForbiddenException('Not authorized');

    return { data: { ...booking, totalPrice: booking.totalPrice.toString() } };
  }

  async cancelVendorBooking(userId: string, id: string) {
    this.logger.log(`Vendor ${userId} cancelling booking ${id}`);
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId)
      throw new ForbiddenException('Not authorized');

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.WAITING_PAYMENT
    ) {
      throw new BadRequestException('Cannot cancel booking in current status');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
    return {
      data: {
        id: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt,
      },
    };
  }

  // --- Organizer Operations ---
  async findOrganizerBookings(organizerId: string, query: QueryBookingDto) {
    const { page, limit, eventId, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {
      booth: {
        event: {
          organizerId,
        },
      },
    };
    if (eventId) where.booth = { eventId };
    if (status) where.status = status as BookingStatus;

    const [data, totalData] = await Promise.all([
      this.prisma.booking.findMany({ where, skip, take: limit }),
      this.prisma.booking.count({ where }),
    ]);

    const serializedData = data.map((d) => ({
      ...d,
      totalPrice: d.totalPrice.toString(),
    }));
    return {
      data: serializedData,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async findOrganizerBookingDetail(organizerId: string, id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { booth: { include: { event: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.booth?.event?.organizerId !== organizerId)
      throw new ForbiddenException('Not authorized');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { booth, ...bookingData } = booking;
    return {
      data: { ...bookingData, totalPrice: bookingData.totalPrice.toString() },
    };
  }

  async updateOrganizerBookingStatus(
    organizerId: string,
    id: string,
    dto: UpdateBookingStatusDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { booth: { include: { event: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.booth?.event?.organizerId !== organizerId)
      throw new ForbiddenException('Not authorized');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: dto.status as BookingStatus },
    });
    return {
      data: {
        id: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt,
      },
    };
  }

  async getOrganizerEventAttendees(organizerId: string, eventId: string) {
    // verify event
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== organizerId)
      throw new ForbiddenException('Not authorized');

    const attendees = await this.prisma.booking.findMany({
      where: {
        booth: { eventId },
        status: BookingStatus.APPROVED,
      },
      select: {
        id: true,
        userId: true,
        boothId: true,
      },
    });

    // Remap response
    const mapped = attendees.map((a) => ({
      bookingId: a.id,
      userId: a.userId,
      boothId: a.boothId,
    }));
    return { data: mapped };
  }

  // --- Admin Operations ---
  async findAdminBookings(query: QueryBookingDto) {
    const { page, limit, eventId, userId, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};
    if (eventId) where.booth = { eventId };
    if (userId) where.userId = userId;
    if (status) where.status = status as BookingStatus;

    const [data, totalData] = await Promise.all([
      this.prisma.booking.findMany({ where, skip, take: limit }),
      this.prisma.booking.count({ where }),
    ]);

    const serializedData = data.map((d) => ({
      ...d,
      totalPrice: d.totalPrice.toString(),
    }));
    return {
      data: serializedData,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async findAdminBookingDetail(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    return { data: { ...booking, totalPrice: booking.totalPrice.toString() } };
  }

  async forceCancelAdminBooking(id: string) {
    this.logger.log(`Admin forcing cancel on booking ${id}`);
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
    return {
      data: {
        id: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt,
      },
    };
  }
}
