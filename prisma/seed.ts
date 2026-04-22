import { PrismaClient, Role, BoothStatus, BookingStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Users
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Admin Boothable', email: 'admin@boothable.com', password: 'hashedpassword', role: Role.ADMIN } }),
    prisma.user.create({ data: { name: 'Organizer A', email: 'orgA@abc.com', password: 'hashedpassword', role: Role.ORGANIZER } }),
    prisma.user.create({ data: { name: 'Vendor 1', email: 'vendor1@abc.com', password: 'hashedpassword', role: Role.VENDOR } }),
    prisma.user.create({ data: { name: 'Organizer B', email: 'orgB@abc.com', password: 'hashedpassword', role: Role.ORGANIZER } }),
    prisma.user.create({ data: { name: 'Vendor 2', email: 'vendor2@abc.com', password: 'hashedpassword', role: Role.VENDOR } }),
  ]);
  console.log('5 Users seded');

  // 2. Events
  const events = await Promise.all([
    prisma.event.create({ data: { eventName: 'Tech Expo 2026', organizerId: users[1].id, location: 'JCC', startDate: new Date('2026-08-10'), endDate: new Date('2026-08-12'), paymentVa: 'BCA 12345678' } }),
    prisma.event.create({ data: { eventName: 'Food Festival', organizerId: users[1].id, location: 'Senayan', startDate: new Date('2026-09-01'), endDate: new Date('2026-09-05'), paymentVa: 'MANDIRI 87654321' } }),
    prisma.event.create({ data: { eventName: 'Music Concert', organizerId: users[3].id, location: 'ICE BSD', startDate: new Date('2026-10-01'), endDate: new Date('2026-10-03'), paymentVa: 'BNI 11112222' } }),
    prisma.event.create({ data: { eventName: 'Art Exhibition', organizerId: users[3].id, location: 'Museum Nasional', startDate: new Date('2026-11-01'), endDate: new Date('2026-11-05'), paymentVa: 'BCA 55556666' } }),
    prisma.event.create({ data: { eventName: 'Career Fair', organizerId: users[1].id, location: 'Balai Kartini', startDate: new Date('2026-12-01'), endDate: new Date('2026-12-02'), paymentVa: 'BRI 99990000' } }),
  ]);
  console.log('5 Events seeded');

  // 3. Booths
  const booths = await Promise.all([
    prisma.booth.create({ data: { eventId: events[0].id, boothCode: 'T1', type: 'Standard', size: '3x3', pricePerDay: 500000, status: BoothStatus.AVAILABLE, availableStartDate: new Date('2026-08-10'), availableEndDate: new Date('2026-08-12') } }),
    prisma.booth.create({ data: { eventId: events[0].id, boothCode: 'T2', type: 'VIP', size: '5x5', pricePerDay: 1500000, status: BoothStatus.AVAILABLE, availableStartDate: new Date('2026-08-10'), availableEndDate: new Date('2026-08-12') } }),
    prisma.booth.create({ data: { eventId: events[1].id, boothCode: 'F1', type: 'Standard', size: '2x2', pricePerDay: 300000, status: BoothStatus.AVAILABLE, availableStartDate: new Date('2026-09-01'), availableEndDate: new Date('2026-09-05') } }),
    prisma.booth.create({ data: { eventId: events[2].id, boothCode: 'M1', type: 'Standard', size: '3x3', pricePerDay: 400000, status: BoothStatus.AVAILABLE, availableStartDate: new Date('2026-10-01'), availableEndDate: new Date('2026-10-03') } }),
    prisma.booth.create({ data: { eventId: events[3].id, boothCode: 'A1', type: 'Standard', size: '4x4', pricePerDay: 600000, status: BoothStatus.AVAILABLE, availableStartDate: new Date('2026-11-01'), availableEndDate: new Date('2026-11-05') } }),
  ]);
  console.log('5 Booths seeded');

  // 4. Bookings
  const bookings = await Promise.all([
    prisma.booking.create({ data: { userId: users[2].id, boothId: booths[0].id, rentalStartDate: new Date('2026-08-10'), rentalEndDate: new Date('2026-08-12'), status: BookingStatus.WAITING_PAYMENT, totalPrice: 1500000 } }),
    prisma.booking.create({ data: { userId: users[4].id, boothId: booths[1].id, rentalStartDate: new Date('2026-08-10'), rentalEndDate: new Date('2026-08-12'), status: BookingStatus.APPROVED, totalPrice: 4500000 } }),
    prisma.booking.create({ data: { userId: users[2].id, boothId: booths[2].id, rentalStartDate: new Date('2026-09-01'), rentalEndDate: new Date('2026-09-05'), status: BookingStatus.PENDING, totalPrice: 1500000 } }),
    prisma.booking.create({ data: { userId: users[4].id, boothId: booths[3].id, rentalStartDate: new Date('2026-10-01'), rentalEndDate: new Date('2026-10-03'), status: BookingStatus.REJECTED, totalPrice: 1200000 } }),
    prisma.booking.create({ data: { userId: users[2].id, boothId: booths[4].id, rentalStartDate: new Date('2026-11-01'), rentalEndDate: new Date('2026-11-05'), status: BookingStatus.PROCESSING, totalPrice: 3000000 } }),
  ]);
  console.log('5 Bookings seeded');

  // 5. Payments
  await Promise.all([
    prisma.payment.create({ data: { bookingId: bookings[0].id, paymentMethod: PaymentMethod.BANK_TRANSFER, paymentStatus: PaymentStatus.UNPAID } }),
    prisma.payment.create({ data: { bookingId: bookings[1].id, paymentMethod: PaymentMethod.BANK_TRANSFER, paymentStatus: PaymentStatus.PAID, paymentProof: 'https://example.com/proof1.jpg' } }),
    prisma.payment.create({ data: { bookingId: bookings[2].id, paymentMethod: PaymentMethod.BANK_TRANSFER, paymentStatus: PaymentStatus.UNPAID } }),
    prisma.payment.create({ data: { bookingId: bookings[3].id, paymentMethod: PaymentMethod.BANK_TRANSFER, paymentStatus: PaymentStatus.REJECTED, paymentProof: 'https://example.com/proof3.jpg' } }),
    prisma.payment.create({ data: { bookingId: bookings[4].id, paymentMethod: PaymentMethod.BANK_TRANSFER, paymentStatus: PaymentStatus.WAITING_VERIFICATION, paymentProof: 'https://example.com/proof4.jpg' } }),
  ]);
  console.log('5 Payments seeded');

  console.log('Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
