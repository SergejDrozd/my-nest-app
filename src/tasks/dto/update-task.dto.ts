import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  completed: boolean;
}

///curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Купить молоко\"}"