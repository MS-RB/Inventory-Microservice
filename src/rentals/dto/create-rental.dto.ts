import { IsDateString, IsInt, IsEnum, IsArray } from 'class-validator';
import { RentalStatus } from '@prisma/client';

export class CreateRentalDto {
  @IsArray()
  @IsInt({ each: true })
  readonly productIds: number[];

  @IsDateString()
  readonly startDate: string;

  @IsDateString()
  readonly endDate: string;

  @IsEnum(RentalStatus)
  readonly status: RentalStatus;
}
