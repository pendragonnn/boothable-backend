import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, UsePipes, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { createEventSchema, type CreateEventDto, updateEventSchema, type UpdateEventDto } from '../dtos/events.schema';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Role } from '@prisma/client';

@Controller('organizer/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ORGANIZER)
export class OrganizerEventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createEventSchema))
  async create(@GetUser('userId') organizerId: string, @Body() dto: CreateEventDto) {
    return this.eventsService.createOrganizer(organizerId, dto);
  }

  @Get()
  async getAll(
    @GetUser('userId') organizerId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.eventsService.findAllOrganizer(organizerId, { page: Number(page), limit: Number(limit) });
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateEventSchema))
  async update(
    @GetUser('userId') organizerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEventDto
  ) {
    return this.eventsService.updateOrganizer(organizerId, id, dto);
  }

  @Delete(':id')
  async delete(@GetUser('userId') organizerId: string, @Param('id') id: string) {
    return this.eventsService.deleteOrganizer(organizerId, id);
  }

  @Post(':id/map')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/infrastructure/storage/upload/booth_map',
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
  async uploadMap(
    @GetUser('userId') organizerId: string,
    @Param('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @UploadedFile() file: any
  ) {
    if (!file) throw new BadRequestException('File is required');
    // MOCK URL mapping for local storage. Real production would use S3/GCS.
    const port = process.env.PORT || 3000;
    const fileUrl = `http://localhost:${port}/storage/upload/booth_map/${file.filename}`;
    return this.eventsService.uploadMap(organizerId, id, fileUrl);
  }
}
