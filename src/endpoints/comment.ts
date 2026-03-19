import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";
import { COMMENTS_LIST } from "../data/comment-list";

export class RandomComment extends OpenAPIRoute {
  schema = {
    tags: ["Comments"],
    summary: "Get DGSW phrase",
    responses: {
      "200": {
        description: "DGSW 명언을 응답합니다.",
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
    const randomIndex = Math.floor(Math.random() * COMMENTS_LIST.length);
    const randomComment = COMMENTS_LIST[randomIndex];

    return {
      success: true,
      result: randomComment
    };
  }
}
