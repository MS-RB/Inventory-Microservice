import { IsString, IsInt, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Type, Gender, Condition, Size, Status } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly categoryId: number;

  @IsEnum(Type)
  readonly type: Type;

  @IsEnum(Gender)
  readonly gender: Gender;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsInt()
  readonly quantity: number;

  @IsOptional()
  @IsEnum(Size)
  readonly size?: Size;

  @IsOptional()
  @IsEnum(Condition)
  readonly condition?: Condition;

  @IsOptional()
  @IsString()
  readonly area?: string;

  @IsOptional()
  @IsString()
  readonly box?: string;

  @IsEnum(Status)
  readonly status: Status;

  @IsDateString()
  readonly acquisitionDate: string;
}
