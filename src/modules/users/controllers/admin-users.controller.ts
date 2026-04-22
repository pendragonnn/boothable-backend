import { Controller, Get, Patch, Delete, Param, Query, Body, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminUsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role') role?: Role,
  ) {
    const skip = (page - 1) * limit;
    const where = role ? { role } : {};
    
    const { data, totalData } = await this.usersService.findAll({ skip, take: limit, where });
    const totalPage = Math.ceil(totalData / limit);

    return {
      data: data.map(user => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, refreshToken, ...rest } = user;
        return rest;
      }),
      paging: {
        page,
        totalPage,
        totalData
      }
    };
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) return { data: null };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = user;
    return { data: result };
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    const updated = await this.usersService.update(id, body);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = updated;
    return { data: result };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { data: 'OK' };
  }
}
