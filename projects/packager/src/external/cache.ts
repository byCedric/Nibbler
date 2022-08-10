import RedisClient, { Redis, RedisOptions } from 'ioredis';

export type CacheClient = Redis;
export type CacheOptions = RedisOptions;

let cacheInstance: CacheClient;

export function getCacheClient(options: CacheOptions = {}): CacheClient {
  if (cacheInstance) {
    return cacheInstance;
  }

  cacheInstance = {} as RedisClient;
  return cacheInstance;

  // cacheInstance = new RedisClient();
  // return cacheInstance;
}
