import Router from '@koa/router';

import { serveBundle } from './actions/serveBundle';
import { serveGitImport } from './actions/serveGitImport';
import { serveHealthCheck } from './actions/serveHealthCheck';

export function createRouter(): Router {
  const router = new Router();

  // [GET] /status - show health check for the server
  // [GET] /git - import git repository in Snack
  // [GET] /version - ???
  // [GET] /bundle/* - serve bundled package(s)

  router.all('/', (ctx) => ctx.redirect('https://snack.expo.dev'));

  router.get('/status', serveHealthCheck);
  router.get('/git', serveGitImport);

  // [GET] /version - ? see version of snackager (+ maybe supporting SDKs?)
  // [GET] /status - health check for the pod, incl. diskspace and connections
  // [GET] /bundle/<pkg>@<version> - ? pkg info support in the runtime
  // [GET] /bundle/<pkg>@<version>/flat - ? maybe we can use this for types
  // [GET] /bundle/<pkg>@<version>/package - ? maybe for exports support?
  // [GET] /bundle/<pkg>@<version>/<file>
  // [GET] /git - import git repos in Snack

  // router.get('/bundle/@:scope/:name{@:version}?', ...serveBundle);
  router.get('/bundle/@:scope/:name/:entry*{@:version}?', ...serveBundle);
  // router.get('/bundle/:name{@:version}?', ...serveBundle);
  router.get('/bundle/:name/:entry*{@:version}?', ...serveBundle);

  // router.get('/bundle/@:scope/:package', ...serveBundle);
  // router.get('/bundle/@:scope/:package/:file', ...serveBundle);
  // router.get('/bundle/:package', ...serveBundle);

  return router;
}
