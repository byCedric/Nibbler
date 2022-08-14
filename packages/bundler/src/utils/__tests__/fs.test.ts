import { fs, vol } from 'memfs';
import os from 'os';
import path from 'path';

import { temporaryDirectory, removeDirectory } from '../fs';

jest.mock('fs');

describe(temporaryDirectory, () => {
  it('creates temporary directory', async () => {
    await expect(temporaryDirectory()).resolves.toBe(
      // `acme-bundler` is the slugified version of this package name
      await fs.promises.realpath(path.join(os.tmpdir(), 'acme-bundler'))
    );
  });
});

describe(removeDirectory, () => {
  it('removes non-existent folder', async () => {
    vol.fromJSON({});
    await expect(removeDirectory('/test')).resolves.toBeUndefined();
    await expect(vol.existsSync('/test')).toBe(false);
  });

  it('removes empty folder', async () => {
    await vol.promises.mkdir('/test');
    await expect(removeDirectory('/test')).resolves.toBeUndefined();
    await expect(vol.existsSync('/test')).toBe(false);
  });

  it('removes nested folders', async () => {
    await vol.promises.mkdir('/test/one', { recursive: true });
    await expect(removeDirectory('/test')).resolves.toBeUndefined();
    await expect(vol.existsSync('/test')).toBe(false);
  });

  it('removes nested folders and files', async () => {
    vol.fromJSON({
      '/test/file.json': JSON.stringify({ name: 'test' }),
      '/test/one/log.txt': 'output',
    });

    await expect(removeDirectory('/test')).resolves.toBeUndefined();
    await expect(vol.existsSync('/test')).toBe(false);
  });
});
