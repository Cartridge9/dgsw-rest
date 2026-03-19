import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";
import { QUOTES_LIST } from "../data/quotes-list";

export class RandomQuote extends OpenAPIRoute {
  schema = {
    tags: ["Quote"],
    summary: "Get DGSW people Quote",
    responses: {
      "200": {
        description: "DGSW 누군가의 명언을 응답합니다.",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.object({
                name: Str({ example: "홍길동" }),
                comment: Str({ example: "동에 번쩍 서에 번쩍" }),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const randomIndex = Math.floor(Math.random() * QUOTES_LIST.length);
    const randomComment = QUOTES_LIST[randomIndex];

    return {
      success: true,
      result: randomComment
    };
  }
}
