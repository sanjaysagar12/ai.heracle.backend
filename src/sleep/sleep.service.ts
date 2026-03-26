import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSleepDataDto } from './dto/sleep.dto';

@Injectable()
export class SleepService {
  constructor(private readonly prisma: PrismaService) {}

  async addSleepData(userId: string, dto: CreateSleepDataDto) {
    const sleepCycle = await this.prisma.sleepCycle.findFirst({
      where: { userId },
    });

    let currentData: any[] = [];
    if (sleepCycle && sleepCycle.sleepData) {
      currentData = sleepCycle.sleepData as any[];
    }

    // Append new data
    currentData.push(dto);

    // Keep only last 7 items (1 week)
    if (currentData.length > 7) {
      currentData = currentData.slice(-7);
    }

    if (sleepCycle) {
      return this.prisma.sleepCycle.update({
        where: { id: sleepCycle.id },
        data: {
          sleepData: currentData,
        },
      });
    } else {
      return this.prisma.sleepCycle.create({
        data: {
          userId,
          sleepData: currentData,
        },
      });
    }
  }

  async getSleepData(userId: string) {
    const sleepCycle = await this.prisma.sleepCycle.findFirst({
      where: { userId },
    });

    if (!sleepCycle) {
      return { sleepData: [] };
    }

    let currentData = sleepCycle.sleepData as any[];

    // Ensure only last 1 week is stored/returned as per requirement
    if (currentData.length > 7) {
      currentData = currentData.slice(-7);
      // Update DB if we found more than 7 items during GET (optional but good for consistency)
      await this.prisma.sleepCycle.update({
        where: { id: sleepCycle.id },
        data: { sleepData: currentData },
      });
    }

    return { sleepData: currentData };
  }
}
