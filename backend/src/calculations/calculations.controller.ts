import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CalculationsService } from './calculations.service';
import { CreateCalculationDto } from './dto/create-calculation.dto';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calculationsService: CalculationsService) {}

  @Post()
  create(@Body() dto: CreateCalculationDto) {
    return this.calculationsService.create(dto);
  }

  @Get()
  findAll(@Query('limit') limit?: string) {
    const parsed = limit ? parseInt(limit, 10) : 50;
    return this.calculationsService.findAll(
      Number.isFinite(parsed) ? parsed : 50,
    );
  }

  @Delete()
  clearAll() {
    return this.calculationsService.clearAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calculationsService.remove(id);
  }
}
