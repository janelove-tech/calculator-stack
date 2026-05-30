import { BadRequestException, Injectable } from '@nestjs/common';
import { EvaluateDto } from './dto/evaluate.dto';

@Injectable()
export class EvaluateService {
  evaluate(dto: EvaluateDto): number {
    const { operation, value, secondValue, angleMode = 'deg' } = dto;
    const toRad = (x: number) =>
      angleMode === 'deg' ? (x * Math.PI) / 180 : x;
    const fromRad = (x: number) =>
      angleMode === 'deg' ? (x * 180) / Math.PI : x;

    switch (operation) {
      case 'add':
        if (secondValue === undefined) throw new BadRequestException('secondValue required');
        return value + secondValue;
      case 'subtract':
        if (secondValue === undefined) throw new BadRequestException('secondValue required');
        return value - secondValue;
      case 'multiply':
        if (secondValue === undefined) throw new BadRequestException('secondValue required');
        return value * secondValue;
      case 'divide':
        if (secondValue === undefined) throw new BadRequestException('secondValue required');
        if (secondValue === 0) throw new BadRequestException('Division by zero');
        return value / secondValue;
      case 'percent':
        return value / 100;
      case 'sin':
        return Math.sin(toRad(value));
      case 'cos':
        return Math.cos(toRad(value));
      case 'tan':
        return Math.tan(toRad(value));
      case 'asin':
        return fromRad(Math.asin(value));
      case 'acos':
        return fromRad(Math.acos(value));
      case 'atan':
        return fromRad(Math.atan(value));
      case 'log':
        if (value <= 0) throw new BadRequestException('Invalid domain for log');
        return Math.log10(value);
      case 'ln':
        if (value <= 0) throw new BadRequestException('Invalid domain for ln');
        return Math.log(value);
      case 'sqrt':
        if (value < 0) throw new BadRequestException('Invalid domain for sqrt');
        return Math.sqrt(value);
      case 'pow2':
        return value * value;
      case 'pow':
        if (secondValue === undefined) throw new BadRequestException('secondValue required');
        return Math.pow(value, secondValue);
      case 'exp':
        return Math.exp(value);
      case 'tenpow':
        return Math.pow(10, value);
      case 'abs':
        return Math.abs(value);
      case 'factorial': {
        const n = Math.round(value);
        if (n < 0 || !Number.isInteger(n) || n > 170) {
          throw new BadRequestException('Invalid factorial input');
        }
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      }
      default:
        throw new BadRequestException(`Unknown operation: ${operation}`);
    }
  }
}
