import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { queryPaymentSchema, type QueryPaymentDto } from '../dtos/payments.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getAll(@Query(new ZodValidationPipe(queryPaymentSchema)) query: QueryPaymentDto) {
    return this.paymentsService.findAdminPayments(query);
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.paymentsService.findAdminPaymentDetail(id);
  }
}
