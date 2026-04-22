import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { type QueryPaymentDto, type VerifyPaymentDto } from '../dtos/payments.schema';
import { Prisma, PaymentStatus, BookingStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  // --- Vendor Operations ---
  async uploadPaymentProof(userId: string, bookingId: string, paymentMethod: string, fileUrl: string) {
    this.logger.log(`Vendor ${userId} uploaded proof for booking ${bookingId}`);

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true }
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Not authorized to upload proof for this booking');
    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.WAITING_PAYMENT) {
      throw new BadRequestException('Booking is not expecting payment currently');
    }

    let payment = booking.payments;
    if (payment) {
      // Update existing record
      payment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentProof: fileUrl,
          paymentStatus: PaymentStatus.WAITING_VERIFICATION,
        }
      });
    } else {
      // Create new record
      payment = await this.prisma.payment.create({
        data: {
          bookingId,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          paymentProof: fileUrl,
          paymentStatus: PaymentStatus.WAITING_VERIFICATION,
        }
      });
    }

    // Also update booking status
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.WAITING_PAYMENT }
    });

    return { data: payment };
  }

  async findPaymentDetailByBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true }
    });
    
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Not authorized');
    
    const payment = booking.payments;
    if (!payment) throw new NotFoundException('No payment record exists for this booking');

    return { data: payment };
  }

  // --- Organizer Operations ---
  async findOrganizerPayments(organizerId: string, query: QueryPaymentDto) {
    const { page, limit, eventId, paymentStatus } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {
      booking: {
        booth: {
          event: { 
            organizerId,
            ...(eventId ? { id: eventId } : {})
          }
        }
      }
    };

    if (paymentStatus) where.paymentStatus = paymentStatus as PaymentStatus;

    const [data, totalData] = await Promise.all([
      this.prisma.payment.findMany({ where, skip, take: limit }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async verifyPayment(organizerId: string, paymentId: string, dto: VerifyPaymentDto) {
    this.logger.log(`Organizer ${organizerId} verifying payment ${paymentId} -> ${dto.paymentStatus}`);

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            booth: { include: { event: true } }
          }
        }
      }
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.booking?.booth?.event?.organizerId !== organizerId) throw new ForbiddenException('Not authorized to verify this payment');

    // Update payment
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { paymentStatus: dto.paymentStatus as PaymentStatus }
    });

    // Cascade update to Booking status
    let nextBookingStatus = payment.booking.status;
    if (dto.paymentStatus === 'PAID') {
      nextBookingStatus = BookingStatus.APPROVED;
    } else if (dto.paymentStatus === 'REJECTED') {
      nextBookingStatus = BookingStatus.REJECTED;
    }

    if (nextBookingStatus !== payment.booking.status) {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: nextBookingStatus }
      });
    }

    return { data: { id: updatedPayment.id, bookingId: updatedPayment.bookingId, paymentStatus: updatedPayment.paymentStatus, updatedAt: updatedPayment.updatedAt } };
  }

  async getOrganizerStats(organizerId: string) {
    const paidBookingsCount = await this.prisma.booking.count({
      where: { 
        status: BookingStatus.APPROVED,
        booth: { event: { organizerId } }
      }
    });

    // We can aggregate bigints directly but prisma raw might be cleaner or we just use groupBy
    const aggregateRevenue = await this.prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        status: BookingStatus.APPROVED,
        booth: { event: { organizerId } }
      }
    });

    const pendingVerifications = await this.prisma.payment.count({
      where: {
        paymentStatus: PaymentStatus.WAITING_VERIFICATION,
        booking: { booth: { event: { organizerId } } }
      }
    });

    return {
      data: {
        totalRevenue: aggregateRevenue._sum.totalPrice ? aggregateRevenue._sum.totalPrice.toString() : "0",
        totalPaidBookings: paidBookingsCount,
        pendingVerifications
      }
    };
  }

  // --- Admin Operations ---
  async findAdminPayments(query: QueryPaymentDto) {
    const { page, limit, paymentStatus } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};
    if (paymentStatus) where.paymentStatus = paymentStatus as PaymentStatus;

    const [data, totalData] = await Promise.all([
      this.prisma.payment.findMany({ where, skip, take: limit }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data,
      paging: { page, totalPage: Math.ceil(totalData / limit), totalData },
    };
  }

  async findAdminPaymentDetail(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');

    return { data: payment };
  }
}
