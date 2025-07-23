import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto & { userId: string }) {
    const { userId, ...rest } = dto;
    return this.prisma.organization.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.organization.findMany({
      where: { userId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async findOne(id: string, userId: string) {
    const org = await this.prisma.organization.findFirst({
      where: { id, userId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!org)
      throw new BadRequestException('Organization not found or access denied');
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.organization.delete({ where: { id } });
  }
}
