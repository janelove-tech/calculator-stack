import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConvertDto } from './dto/convert.dto';
import { SaveConversionDto } from './dto/save-conversion.dto';

const UNIT_TABLES: Record<string, Record<string, number>> = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523125,
    t: 1000,
  },
  volume: {
    L: 1,
    mL: 0.001,
    gal: 3.785411784,
    qt: 0.946352946,
    pt: 0.473176473,
    cup: 0.2365882365,
    floz: 0.0295735295625,
  },
  area: {
    'm²': 1,
    'km²': 1e6,
    'cm²': 0.0001,
    'ft²': 0.09290304,
    'in²': 0.00064516,
    acre: 4046.8564224,
    ha: 10000,
  },
  time: {
    s: 1,
    ms: 0.001,
    min: 60,
    h: 3600,
    d: 86400,
    wk: 604800,
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  let c: number;
  if (from === 'C') c = value;
  else if (from === 'F') c = ((value - 32) * 5) / 9;
  else if (from === 'K') c = value - 273.15;
  else throw new BadRequestException(`Unknown temperature unit: ${from}`);

  if (to === 'C') return c;
  if (to === 'F') return (c * 9) / 5 + 32;
  if (to === 'K') return c + 273.15;
  throw new BadRequestException(`Unknown temperature unit: ${to}`);
}

@Injectable()
export class ConversionsService {
  constructor(private readonly prisma: PrismaService) {}

  convert(dto: ConvertDto) {
    const { value, category, fromUnit, toUnit } = dto;

    if (category === 'temperature') {
      const result = convertTemperature(value, fromUnit, toUnit);
      return { result, fromUnit, toUnit, category };
    }

    const table = UNIT_TABLES[category];
    if (!table) {
      throw new BadRequestException(`Unknown category: ${category}`);
    }
    if (!(fromUnit in table) || !(toUnit in table)) {
      throw new BadRequestException('Invalid unit for category');
    }

    const base = value * table[fromUnit];
    const result = base / table[toUnit];
    return { result, fromUnit, toUnit, category };
  }

  getCategories() {
    return {
      length: Object.keys(UNIT_TABLES.length),
      weight: Object.keys(UNIT_TABLES.weight),
      volume: Object.keys(UNIT_TABLES.volume),
      area: Object.keys(UNIT_TABLES.area),
      time: Object.keys(UNIT_TABLES.time),
      temperature: ['C', 'F', 'K'],
    };
  }

  savePreset(dto: SaveConversionDto) {
    if (!this.prisma.isConnected()) {
      throw new ServiceUnavailableException('Database is not available');
    }
    return this.prisma.savedConversion.create({ data: dto });
  }

  listPresets() {
    if (!this.prisma.isConnected()) {
      return [];
    }
    return this.prisma.savedConversion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async removePreset(id: string) {
    if (!this.prisma.isConnected()) {
      throw new ServiceUnavailableException('Database is not available');
    }
    return this.prisma.savedConversion.delete({ where: { id } });
  }
}
