import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchProductsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }: { value: string | undefined }) =>
    value !== undefined ? parseFloat(value) : undefined,
  )
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }: { value: string | undefined }) =>
    value !== undefined ? parseFloat(value) : undefined,
  )
  maxPrice?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Transform(({ value }: { value: string | undefined }) =>
    value !== undefined ? parseInt(value, 10) : 20,
  )
  limit: number = 20;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Transform(({ value }: { value: string | undefined }) =>
    value !== undefined ? parseInt(value, 10) : 0,
  )
  offset: number = 0;
}
