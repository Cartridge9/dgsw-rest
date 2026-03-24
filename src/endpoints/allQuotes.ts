import { OpenAPIRoute, Str, Num } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";
import { QUOTES_LIST } from "../data/quotes-list";

export class AllQuotes extends OpenAPIRoute {
  schema = {
    tags: ["Quote"],
    summary: "Get All DGSW Quotes",
    responses: {
      "200": {
        description: "모든 DGSW 명언을 응답합니다.",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.object({
                quotes: z.array(
                  z.object({
                    name: Str({ example: "홍길동" }),
                    comment: Str({ example: "동에 번쩍 서에 번쩍" }),
                  })
                ),
                total: Num({ example: 5 }),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    return {
      success: true,
      result: {
        quotes: QUOTES_LIST,
        total: QUOTES_LIST.length,
      },
    };
  }
}
