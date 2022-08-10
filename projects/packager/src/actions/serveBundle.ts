import assert from 'assert';
import httpStatus from 'http-status-codes';

import { ServerError, ServerMiddleware } from '../server';
import { fetchBundleManifest } from '../utils/bundleManifest';
import { parseBundleRequest } from '../utils/bundleRequest';

/**
 * Parse the bundle request and validate if everyhing is set.
 * If so, set the `bundleRequest` state and continue.
 */
export const validateBundleRequest: ServerMiddleware = (ctx, next) => {
  try {
    ctx.state.bundleRequest = parseBundleRequest(ctx);
  } catch (error) {
    throw new ServerError(httpStatus.BAD_REQUEST, error.message);
  }

  return next();
};

/**
 * Resolve the bundle manifest from the parsed bundle request.
 * If this can't be fetched, it will throw and exit.
 */
export const validateBundleManifest: ServerMiddleware = async (ctx, next) => {
  assert(ctx.state.bundleRequest, 'No bundle request found');

  try {
    ctx.state.bundleManifest = await fetchBundleManifest(ctx.state.bundleRequest);
  } catch (error) {
    throw new ServerError(httpStatus.NOT_FOUND, error.message);
  }

  return next();
};

/** Serve the cached bundle response, if any */
export const serveBundleFromCache: ServerMiddleware = (ctx, next) => {
  assert(ctx.state.bundleRequest, 'No bundle request found');
  return next();
};

/** Create the bundle from source, and serve it */
export const serveBundleFromSource: ServerMiddleware = (ctx, next) => {
  assert(ctx.state.bundleManifest, 'No bundle manifest found');
  ctx.response.body = { state: ctx.state, params: ctx.params };
};

export const serveBundle = [
  validateBundleRequest,
  validateBundleManifest,
  serveBundleFromCache,
  serveBundleFromSource,
];
