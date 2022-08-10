import { createMockContext } from '@shopify/jest-koa-mocks';

import { ServerContext } from '../../server';
import { parseBundleRequest } from '../bundleRequest';

describe(parseBundleRequest, () => {
  it('throws without :name', () => {
    expect(() => parseTest('/', {})).toThrow('No name provided');
  });

  it('returns request with :name', () => {
    expect(parseTest('/', { name: 'expo' })).toMatchObject({
      name: 'expo',
      version: 'latest',
      platforms: ['android', 'ios', 'web'],
    });
  });

  it('returns request with :scope and :name', () => {
    expect(parseTest('/', { scope: 'expo', name: 'config-plugins' })).toMatchObject({
      name: '@expo/config-plugins',
      version: 'latest',
      platforms: ['android', 'ios', 'web'],
    });
  });

  it('returns request with :scope, :name, and :version', () => {
    expect(
      parseTest('/', { scope: 'expo', name: 'config-plugins', version: '^4.0.0' })
    ).toMatchObject({
      name: '@expo/config-plugins',
      version: '^4.0.0',
      platforms: ['android', 'ios', 'web'],
    });
  });

  it('returns request with :scope, :name, :version, and :entry', () => {
    expect(
      parseTest('/', {
        scope: 'expo',
        name: 'config-plugins',
        entry: 'folder/file.js',
        version: '^4.0.0',
      })
    ).toMatchObject({
      name: '@expo/config-plugins',
      version: '^4.0.0',
      entry: 'folder/file.js',
      platforms: ['android', 'ios', 'web'],
    });
  });

  it('returns request with platform', () => {
    expect(parseTest('/?platforms=android', { name: 'expo' })).toMatchObject({
      name: 'expo',
      version: 'latest',
      platforms: ['android'],
    });
  });

  it('returns request with comma-separated platforms', () => {
    expect(parseTest('/?platforms=web,ios', { name: 'expo' })).toMatchObject({
      name: 'expo',
      version: 'latest',
      platforms: ['ios', 'web'], // order here is important
    });
  });

  it('returns request with multi platforms query parameters', () => {
    expect(parseTest('/?platforms=web&platforms=android', { name: 'expo' })).toMatchObject({
      name: 'expo',
      version: 'latest',
      platforms: ['android', 'web'], // order here is important
    });
  });
});

function parseTest(url: string, params: Record<string, string>) {
  const ctx = createMockContext({ url, customProperties: { params } });
  return parseBundleRequest(ctx as ServerContext);
}
