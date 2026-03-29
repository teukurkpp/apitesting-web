import {
  IsString,
  IsUrl,
  IsIn,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateApiDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsIn(['GET', 'POST', 'PUT', 'DELETE'])
  method: string;

  @IsNumber()
  @Min(10)
  interval: number;

  @IsOptional()
  status?: 'active' | 'inactive';
}
