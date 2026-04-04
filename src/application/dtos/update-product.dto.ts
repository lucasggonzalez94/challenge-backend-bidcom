import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;
}

export class PatchProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  category?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  brand?: string;
}
