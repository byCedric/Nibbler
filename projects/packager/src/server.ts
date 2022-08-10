import cors from '@koa/cors';
import { RouterContext } from '@koa/router';
import Koa from 'koa';

import { CacheClient, getCacheClient } from './external/cache';
import type { BundleManifest } from './utils/bundleManifest';
import type { BundleRequest } from './utils/bundleRequest';

export type ServerState = {
  bundleRequest?: BundleRequest;
  bundleManifest?: BundleManifest;
};

export type ServerContext = RouterContext<
  ServerState,
  {
    cache: CacheClient;
    log: {
      log: typeof console.log;
      info: typeof console.info;
      warn: typeof console.warn;
      error: typeof console.error;
    }; // TODO(cedric): bunyan logger
  }
>;

export type ServerMiddleware = Koa.Middleware<ServerState, ServerContext>;

export class ServerError extends Error {
  public readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export function createServer() {
  const app = new Koa<ServerState, ServerContext>();

  app.use(cors());
  app.context.cache = getCacheClient();
  app.context.log = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  return app;
}
