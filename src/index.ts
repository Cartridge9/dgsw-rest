import { fromHono } from "chanfana";
import { Hono } from "hono";
import { RandomComment } from "./endpoints/comment";
import html from "./page/index.html";
import { parse } from "node-html-parser";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/docs",
});

// Register OpenAPI endpoints
openapi.get("/comment", RandomComment);

app.get("/", (c) => c.html(parse(html).toString()));

// Export the Hono app
export default app;
