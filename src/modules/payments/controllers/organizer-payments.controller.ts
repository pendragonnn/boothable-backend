import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { queryPaymentSchema, type QueryPaymentDto, verifyPaymentSchema, type VerifyPaymentDto } from '../dtos/payments.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@Controller('organizer/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ORGANIZER)
export class OrganizerPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('stats')
  async getPaymentStats(@GetUser('userId') organizerId: string) {
    return this.paymentsService.getOrganizerStats(organizerId);
  }

  @Get()
  async getManagedPayments(
    @GetUser('userId') organizerId: string,
    @Query(new ZodValidationPipe(queryPaymentSchema)) query: QueryPaymentDto
  ) {
    return this.paymentsService.findOrganizerPayments(organizerId, query);
  }

  @Patch(':id/verify')
  async verifyPayment(
    @GetUser('userId') organizerId: string,
    @Param('id') paymentId: string,
    @Body(new ZodValidationPipe(verifyPaymentSchema)) dto: VerifyPaymentDto
  ) {
    return this.paymentsService.verifyPayment(organizerId, paymentId, dto);
  }
}
