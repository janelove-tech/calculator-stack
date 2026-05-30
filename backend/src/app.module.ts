import { Module } from '@nestjs/common';
import { CalculationsModule } from './calculations/calculations.module';
import { ConversionsModule } from './conversions/conversions.module';
import { EvaluateModule } from './evaluate/evaluate.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    CalculationsModule,
    ConversionsModule,
    EvaluateModule,
  ],
})
export class AppModule {}
