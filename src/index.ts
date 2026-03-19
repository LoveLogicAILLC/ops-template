import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use('*', logger());

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * Health check endpoint.
 * Returns service name, status, and current timestamp.
 */
app.get('/health', (c) => {
  return c.json({
    service: 'ops-template',
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.0.0',
  });
});

/**
 * Root endpoint — basic hello world.
 */
app.get('/', (c) => {
  return c.json({
    message: 'Hello from LoveLogicAI ops-template 🚀',
    docs: '/health',
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.notFound((c) => {
  return c.json({ error: 'Not found', path: c.req.path }, 404);
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// ── Server bootstrap (Node / Bun runtime only) ────────────────────────────────
const port = Number(process.env.PORT) || 3000;

export default {
  port,
  fetch: app.fetch,
};
