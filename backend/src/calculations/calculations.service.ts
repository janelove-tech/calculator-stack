import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';

@Injectable()
export class CalculationsService {
  constructor(private readonly prisma: PrismaService) {}

  private assertDb() {
    if (!this.prisma.isConnected()) {
      throw new ServiceUnavailableException(
        'Database is not available. Start PostgreSQL and run prisma migrate deploy.',
      );
    }
  }

  create(dto: CreateCalculationDto) {
    this.assertDb();
    return this.prisma.calculationHistory.create({
      data: {
        mode: dto.mode,
        expression: dto.expression,
        result: dto.result,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  findAll(limit = 50) {
    if (!this.prisma.isConnected()) {
      return [];
    }
    return this.prisma.calculationHistory.findMany({
      take: Math.min(limit, 100),
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    this.assertDb();
    try {
      return await this.prisma.calculationHistory.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Calculation ${id} not found`);
    }
  }

  clearAll() {
    this.assertDb();
    return this.prisma.calculationHistory.deleteMany();
  }
}
