import { handleError } from './middleware/handleError';
import { createRouter } from './router';
import { createServer } from './server';
import { env } from './utils/env';

const port = env.PACKAGER_PORT;
const server = createServer();
const router = createRouter();

server
  .use(handleError)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.log('Server listening on port %s, Ctrl+C to quit', port);
  });
