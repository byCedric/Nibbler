import { Context } from 'koa';

// TODO: add check for:
//  - disk space
//  - connection to cache
//  - connection to storage
export function serveHealthCheck(ctx: Context) {
  ctx.body = {
    status: 'ok', // 'error'
    // checks: [
    //   // { name: 'diskspace' }
    // ]
  };
}
