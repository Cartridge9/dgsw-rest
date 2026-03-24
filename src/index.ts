import { fromHono } from "chanfana";
import { Hono } from "hono";
import { RandomQuote } from "./endpoints/quotes";
import { AllQuotes } from "./endpoints/allQuotes";
import html from "./page/index.html";
import { parse } from "node-html-parser";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/docs",
});

// Register OpenAPI endpoints
openapi.get("/quote", RandomQuote);
openapi.get("/quote/all", AllQuotes);

app.get("/", (c) => c.html(parse(html).toString()));

// Export the Hono app
export default app;
