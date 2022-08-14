import { vol } from 'memfs';

import { getEntryPoints } from '../package';

jest.mock('fs');

describe(getEntryPoints, () => {
  it('returns default entrypoint as object', async () => {
    vol.fromJSON({
      '/folder/node_modules/test/package.json': JSON.stringify({
        name: 'test',
        version: '0.0.0',
        main: './lib/biepboep.js',
      }),
    });

    await expect(getEntryPoints({ name: 'test' }, { cwd: '/folder' })).resolves.toMatchObject({
      index: 'test',
    });
  });

  it('returns exports entrypoint as object', async () => {
    vol.fromJSON({
      'other/node_modules/newmodule/package.json': JSON.stringify({
        name: 'newmodule',
        version: '0.0.0',
        exports: {
          './one': './lib/one.js',
          './two/three': './lib/two.js',
        },
      }),
    });

    await expect(getEntryPoints({ name: 'newmodule' }, { cwd: 'other' })).resolves.toMatchObject({
      one: 'newmodule/one',
      'two/three': 'newmodule/two/three',
    });
  });

  it('returns exports entrypoint as object over default', async () => {
    vol.fromJSON({
      'another/node_modules/mixedmodule/package.json': JSON.stringify({
        name: 'mixedmodule',
        version: '0.0.0',
        main: './lib/one.js',
        exports: {
          './one': './lib/one.js',
          './two/three': './lib/two.js',
        },
      }),
    });

    await expect(
      getEntryPoints({ name: 'mixedmodule' }, { cwd: 'another' })
    ).resolves.toMatchObject({
      one: 'mixedmodule/one',
      'two/three': 'mixedmodule/two/three',
    });
  });

  it('filters package.json exports', async () => {
    vol.fromJSON({
      'folder/node_modules/pkgexport/package.json': JSON.stringify({
        name: 'pkgexport',
        version: '0.0.0',
        exports: {
          './entry': './entry.js',
          './package.json': './package.json',
        },
      }),
    });

    const result = await getEntryPoints({ name: 'pkgexport' }, { cwd: 'folder' });

    expect(result).toHaveProperty('entry', 'pkgexport/entry');
    expect(result).not.toHaveProperty('package.json');
  });

  it('converts . to index exports', async () => {
    vol.fromJSON({
      'folder/node_modules/pkgexport/package.json': JSON.stringify({
        name: 'pkgexport',
        version: '0.0.0',
        exports: {
          './entry': './entry.js',
          '.': './other/entry.js',
        },
      }),
    });

    const result = await getEntryPoints({ name: 'pkgexport' }, { cwd: 'folder' });

    expect(result).toHaveProperty('entry', 'pkgexport/entry');
    expect(result).toHaveProperty('index', 'pkgexport');
  });
});
