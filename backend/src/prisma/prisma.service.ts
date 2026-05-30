import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private connected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.connected = true;
      console.log('Database connected');
    } catch (err) {
      console.warn(
        'Database unavailable — start PostgreSQL (docker compose up -d) and run: npm exec prisma migrate deploy',
      );
      console.warn(err);
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.$disconnect();
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
