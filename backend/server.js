import http from "node:http";
import {Hono} from 'hono';
import {serve} from '@hono/node-server'


const app = new Hono();

app.get('/test', (c) => {
  return c.text("test");
})

serve({
  fetch: app.fetch,
  port: 3000
})


