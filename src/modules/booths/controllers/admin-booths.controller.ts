import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, UsePipes } from '@nestjs/common';
import { BoothsService } from '../services/booths.service';
import { queryBoothSchema, type QueryBoothDto, updateBoothSchema, type UpdateBoothDto } from '../dtos/booths.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/booths')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminBoothsController {
  constructor(private readonly boothsService: BoothsService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(queryBoothSchema))
  async getAll(@Query() query: QueryBoothDto) {
    return this.boothsService.findAllAdmin(query);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateBoothSchema))
  async update(@Param('id') id: string, @Body() dto: UpdateBoothDto) {
    return this.boothsService.updateAdmin(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.boothsService.deleteAdmin(id);
  }
}
