import { Injectable } from "@nestjs/common";

@Injectable()
export class Pagination {

    getPagination(total: number, offset: number, limit: number): object {
        return {
            total,
            offset: offset || 0,
            limit,
        }
    }
}
