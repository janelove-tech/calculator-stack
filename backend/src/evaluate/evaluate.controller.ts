import { Body, Controller, Post } from '@nestjs/common';
import { EvaluateDto } from './dto/evaluate.dto';
import { EvaluateService } from './evaluate.service';

@Controller('evaluate')
export class EvaluateController {
  constructor(private readonly evaluateService: EvaluateService) {}

  @Post()
  evaluate(@Body() dto: EvaluateDto) {
    const result = this.evaluateService.evaluate(dto);
    return { result, operation: dto.operation };
  }
}
