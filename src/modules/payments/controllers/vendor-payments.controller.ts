import { Controller, Post, Get, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Body } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.VENDOR)
export class VendorPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id/payments')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/infrastructure/storage/upload/payment_proof',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + extname(file.originalname);
        cb(null, uniqueSuffix);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  async uploadPayment(
    @GetUser('userId') userId: string,
    @Param('id') bookingId: string,
    @Body('paymentMethod') paymentMethod: string = 'Bank Transfer',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @UploadedFile() file: any
  ) {
    if (!file) throw new BadRequestException('File is required');
    const port = process.env.PORT || 3000;
    const fileUrl = `http://localhost:${port}/storage/upload/payment_proof/${file.filename}`;
    return this.paymentsService.uploadPaymentProof(userId, bookingId, paymentMethod, fileUrl);
  }

  @Get(':id/payments')
  async getPaymentDetail(
    @GetUser('userId') userId: string,
    @Param('id') bookingId: string
  ) {
    return this.paymentsService.findPaymentDetailByBooking(userId, bookingId);
  }
}
