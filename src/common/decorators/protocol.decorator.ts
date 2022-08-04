import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Protocol = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        console.log(`Esse parametro é passado como argumento em @Protocol() com o valor ${data}`);
        const request = ctx.switchToHttp().getRequest()
        return request.protocol
    }
)
