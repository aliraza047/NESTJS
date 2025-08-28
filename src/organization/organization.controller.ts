import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CurrentUser } from 'src/shared/decorator/get-current-user-id.decorator';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.orgService.create({ ...dto, userId });
  }

  @Get()
  async findAll(@CurrentUser('userId') userId: string) {
    return this.orgService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.orgService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.orgService.update(id, dto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.orgService.remove(id, userId);
  }
}
