import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  title?: string;
}