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

  findOne(id: string) {
    return this.prisma.institution.findUnique({
      where: { id },
    });
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
      return { message: `Institusi dengan ID ${id} berhasil dihapus.` };
    } catch (error) {
      throw new NotFoundException(`Institusi dengan ID ${id} tidak ditemukan.`);
    }
  }
}