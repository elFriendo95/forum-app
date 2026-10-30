import { IsString, IsInt, MaxLength, Min, MinLength } from 'class-validator';
export class CreatePostDto {
  @IsString()
  @MaxLength(200)
  @MinLength(3)
  title: string;

  @IsString()
  @MaxLength(5000)
  @MinLength(1)
  body: string;

  @IsInt()
  @Min(1)
  categoryId: number;
}
