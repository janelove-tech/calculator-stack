import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConversionsService } from './conversions.service';
import { ConvertDto } from './dto/convert.dto';
import { SaveConversionDto } from './dto/save-conversion.dto';

@Controller('conversions')
export class ConversionsController {
  constructor(private readonly conversionsService: ConversionsService) {}

  @Get('categories')
  getCategories() {
    return this.conversionsService.getCategories();
  }

  @Post('convert')
  convert(@Body() dto: ConvertDto) {
    return this.conversionsService.convert(dto);
  }

  @Get('presets')
  listPresets() {
    return this.conversionsService.listPresets();
  }

  @Post('presets')
  savePreset(@Body() dto: SaveConversionDto) {
    return this.conversionsService.savePreset(dto);
  }

  @Delete('presets/:id')
  removePreset(@Param('id') id: string) {
    return this.conversionsService.removePreset(id);
  }
}
