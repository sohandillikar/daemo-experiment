import { DaemoFunction } from "daemo-engine";
import { z } from "zod";

export class CalculatorService {
    @DaemoFunction({
        description: "Calculate the power of a number",
        inputSchema: z.object({
            a: z.number(),
            b: z.number(),
        }),
        outputSchema: z.number()
    })
    async power(args: { a: number, b: number }) {
        return Math.pow(args.a, args.b);
    }
}