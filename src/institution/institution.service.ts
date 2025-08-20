import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institutioin.dto';

@Injectable()
export class InstitutionService {
  constructor(private prisma: PrismaService) {}

  create(createInstitutionDto: CreateInstitutionDto) {
    return this.prisma.institution.create({
      data: createInstitutionDto,
    });
  }

  findAll() {
    return this.prisma.institution.findMany();
  }

  async findOne(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!institution) {
      throw new NotFoundException(`Institution with ID ${id} not found.`);
    }

    return institution;
  }
  
    async update(id: string, updateInstitutionDto: UpdateInstitutionDto) {
    try {
      return await this.prisma.institution.update({
        where: { id },
        data: updateInstitutionDto,
      });
    } catch (error) {
      throw new NotFoundException(`Institusi dengan ID ${id} tidak ditemukan.`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.institution.delete({
        where: { id },
      });
      return { message: `Institution with ID ${id} has been successfully deleted.` };
    } catch (error) {
      throw new NotFoundException(`Institution with ID ${id} not found.`);
    }
  }

  async getServices(institutionId: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
      include: {
        services: true,
      },
    });

    if (!institution) {
      throw new NotFoundException(`Institution with ID ${institutionId} not found.`);
    }

    return institution.services;
  }
}