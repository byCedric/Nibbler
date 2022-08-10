import { AssertionError } from 'assert';
import httpStatus from 'http-status-codes';

import { ServerError, ServerMiddleware } from '../server';

export const handleError: ServerMiddleware = async ({ response }, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ServerError) {
      response.status = error.status ?? httpStatus.INTERNAL_SERVER_ERROR;
      response.body = {
        errorStatus: response.status,
        errorMessage: error.message,
      };
      return;
    }

    if (error instanceof AssertionError) {
      response.status = httpStatus.INTERNAL_SERVER_ERROR;
      response.body = {
        errorStatus: response.status,
        errorMessage: error.message,
      };
    }

    throw error;
  }
};
