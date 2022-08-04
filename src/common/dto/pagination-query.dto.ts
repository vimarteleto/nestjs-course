import { IsOptional, IsPositive } from "class-validator"

export class PaginationQueryDto {
    @IsPositive()
    @IsOptional()
    limit: number = 50

    @IsPositive()
    @IsOptional()
    offset: number
}
