import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";
import { QUOTES_LIST } from "../data/quotes-list";

// 인메모리 정답 저장소 (Cloudflare Workers isolate 간 상태 공유 안됨 - 알려진 제한사항)
const answerStore = new Map<string, { correctAnswer: string; expiresAt: number }>();

function generateId(): string {
  return crypto.randomUUID();
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function cleanExpiredAnswers() {
  const now = Date.now();
  for (const [id, data] of answerStore) {
    if (data.expiresAt < now) {
      answerStore.delete(id);
    }
  }
}

export class Quiz extends OpenAPIRoute {
  schema = {
    tags: ["Quiz"],
    summary: "Get a Quiz Question",
    responses: {
      "200": {
        description: "명언을 보고 누가 한 말인지 맞추는 퀴즈를 반환합니다.",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.object({
                quote: Str({ example: "인생은 짧고 예술은 길다" }),
                choices: z.array(Str({ example: "홍길동" })),
                answerId: Str({ example: "550e8400-e29b-41d4-a716-446655440000" }),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(_c: AppContext) {
    cleanExpiredAnswers();

    const randomIndex = Math.floor(Math.random() * QUOTES_LIST.length);
    const correctQuote = QUOTES_LIST[randomIndex];

    const uniqueNames = [...new Set(QUOTES_LIST.map((q) => q.name))];
    const otherNames = uniqueNames.filter((name) => name !== correctQuote.name);
    const choiceCount = Math.min(3, otherNames.length);
    const wrongNames = shuffleArray(otherNames).slice(0, choiceCount);

    const choices = shuffleArray([correctQuote.name, ...wrongNames]);

    const answerId = generateId();
    answerStore.set(answerId, {
      correctAnswer: correctQuote.name,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return {
      success: true,
      result: {
        quote: correctQuote.quote,
        choices,
        answerId,
      },
    };
  }
}

export class QuizOpen extends OpenAPIRoute {
  schema = {
    tags: ["Quiz"],
    summary: "Get an Open-Ended Quiz Question",
    responses: {
      "200": {
        description: "명언을 보고 누가 한 말인지 직접 입력하는 주관식 퀴즈를 반환합니다.",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.object({
                quote: Str({ example: "인생은 짧고 예술은 길다" }),
                hint: Str({ example: "ㅎㄱㄷ" }),
                answerId: Str({ example: "550e8400-e29b-41d4-a716-446655440000" }),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(_c: AppContext) {
    cleanExpiredAnswers();

    const randomIndex = Math.floor(Math.random() * QUOTES_LIST.length);
    const correctQuote = QUOTES_LIST[randomIndex];

    const hint = correctQuote.name
      .split("")
      .map((ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 0xAC00 && code <= 0xD7A3) {
          return String.fromCharCode(Math.floor((code - 0xAC00) / 588) + 0x3131);
        }
        return "*";
      })
      .join("");

    const answerId = generateId();
    answerStore.set(answerId, {
      correctAnswer: correctQuote.name,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return {
      success: true,
      result: {
        quote: correctQuote.quote,
        hint,
        answerId,
      },
    };
  }
}

export class QuizAnswer extends OpenAPIRoute {
  schema = {
    tags: ["Quiz"],
    summary: "Submit a Quiz Answer",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              answerId: Str({ description: "퀴즈 문제의 ID", example: "550e8400-e29b-41d4-a716-446655440000" }),
              answer: Str({ description: "선택한 인물 이름", example: "홍길동" }),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "정답 여부를 반환합니다.",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              result: z.object({
                correct: z.boolean(),
                correctAnswer: Str({ example: "홍길동" }),
              }),
            }),
          },
        },
      },
      "400": {
        description: "유효하지 않거나 만료된 퀴즈 ID입니다.",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              error: Str({ example: "유효하지 않거나 만료된 퀴즈입니다." }),
            }),
          },
        },
      },
    },
  };

  async handle(_c: AppContext) {
    cleanExpiredAnswers();

    const data = await this.getValidatedData<typeof this.schema>();
    const { answerId, answer } = data.body;

    const stored = answerStore.get(answerId);
    if (!stored || stored.expiresAt < Date.now()) {
      if (stored) answerStore.delete(answerId);
      return Response.json(
        { success: false, error: "유효하지 않거나 만료된 퀴즈입니다." },
        { status: 400 }
      );
    }

    const normalize = (s: string) => s.replace(/\s/g, "");
    const correct = normalize(stored.correctAnswer) === normalize(answer);
    const correctAnswer = stored.correctAnswer;

    answerStore.delete(answerId);

    return {
      success: true,
      result: {
        correct,
        correctAnswer,
      },
    };
  }
}
